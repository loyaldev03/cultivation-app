module Inventory
  class QueryMaterialCount
    prepend SimpleCommand

    attr_reader :product_ids, :facility_id, :user

    def initialize(product_ids, facility_id, user = nil)
      @product_ids = product_ids.map { |x| x.to_bson_id } rescue []
      @facility_id = facility_id
      @user = user
    end

    def call
      received_inventories = Inventory::Product.collection.aggregate([
        {'$match': {'_id': {'$in': product_ids}}},
        {'$lookup': {from: 'inventory_item_transactions', localField: '_id', foreignField: 'product_id', as: 'tx'}},
        {'$unwind': {'path': '$tx', 'preserveNullAndEmptyArrays': false}},
        {'$match': {
          'tx.event_type': {
            '$nin': ['material_used', 'material_waste'],
          },
        }},
        {"$group": {
          _id: '$_id',
          name: {"$first": '$name'},
          uom: {'$last': '$tx.common_uom'},
          total_available_qty: {'$sum': {'$toDecimal': '$tx.common_quantity'}},
        }},
      ])

      ##
      # Used or allocated inventory comes from Cultivation Batches that are currently active or planned.
      # For each task, take the max between planned or (accumulated used + waste) quantity.
      # Accumulate the final quantity by each product.

      batch_ids = Cultivation::Batch.where(
        status: {'$in': [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE]},
      ).pluck(:id)

      used_or_allocated_inventories =
        Cultivation::Task.collection.aggregate([
          {"$match": {batch_id: {'$in': batch_ids}}},
          {"$unwind": {"path": '$material_use', "preserveNullAndEmptyArrays": false}},
          {"$lookup": {from: 'inventory_item_transactions', localField: 'material_use._id', foreignField: 'ref_id', as: 'tx'}},
          {"$lookup": {from: 'inventory_products', localField: 'material_use.product_id', foreignField: '_id', as: 'pd'}},
          {
            "$project": {
              id: '$_id',
              tasks: '$name',
              material_use_id: '$material_use_id',
              product_id: '$material_use.product_id',
              product_name: {"$arrayElemAt": ['$pd.name', 0]},
              planned_quantity: '$material_use.quantity',
              sum_used_quantity: {
                "$abs": {
                  "$reduce": {
                    input: '$tx.common_quantity',
                    initialValue: 0,
                    in: {"$add": ['$$value', {'$abs': {"$toDecimal": '$$this'}}]},
                  },
                },
              },
            },
          },
          {
            "$project": {
              id: 1,
              tasks: 1,
              material_use_id: 1,
              product_id: 1,
              product_name: 1,
              planned_quantity: 1,
              sum_used_quantity: 1,
              final_qty: {
                "$cond": {
                  "if": {"$gte": ['$planned_quantity', '$sum_used_quantity']},
                  "then": '$planned_quantity',
                  "else": '$sum_used_quantity',
                },
              },
            },
          },
          {
            "$group": {
              _id: '$product_id',
              name: {"$first": '$product_name'},
              total_planned: {"$sum": '$planned_quantity'},
              total_used_waste: {"$sum": '$sum_used_quantity'},
              total_planned_or_used: {"$sum": '$final_qty'},
            },
          },
        ])

      # Compile end result by product id
      availability = Hash.new do |hash, key|
        hash[key] = {
          product_id: key,
          name: '',
          intake: 0,
          planned_or_used: 0,
          available: 0,
          is_available: false,  # if true if intake > planned_or_used
        }
      end

      products = Inventory::Product.where(
        "_id": {"$in": product_ids},
        facility_id: facility_id,
      )

      products.each do |product|
        key = product.id.to_s
        availability[key][:name] = product.name
        availability[key][:common_uom] = product.common_uom
      end

      received_inventories.each do |row|
        key = row['_id'].to_s
        availability[key][:intake] = to_decimal(row[:total_available_qty])
        availability[key][:name] = row[:name]
      end

      used_or_allocated_inventories.each do |row|
        key = row['_id'].to_s
        total_planned_or_used = to_decimal(row[:total_planned_or_used])
        available = availability[key][:intake] - total_planned_or_used

        availability[key][:planned_or_used] = total_planned_or_used
        availability[key][:available] = available
        # availability[key][:available] = availability[key][:intake]

        # True if intake > planned_or_used
        availability[key][:is_available] = available > 0
        # availability[key][:is_available] = false
      end

      availability
    end

    def to_decimal(maybe_bson_decimal128)
      if maybe_bson_decimal128.is_a?(BSON::Decimal128)
        d = maybe_bson_decimal128.to_big_decimal
        d.nan? ? 0 : d
      else
        maybe_bson_decimal128
      end
    end
  end
end

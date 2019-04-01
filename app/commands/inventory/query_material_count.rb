module Inventory
  class QueryMaterialCount
    prepend SimpleCommand

    attr_reader :product_ids, :facility_id

    def initialize(product_ids, facility_id)
      @product_ids = product_ids.map { |x| x.to_bson_id } rescue []
      @facility_id = facility_id
      # @user = user
    end

    def call
      available_inventories = Inventory::Product.collection.aggregate([
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
          common_quantity: {'$sum': {'$toDecimal': '$tx.common_quantity'}},
        }},
      ])

      # Planned to use equals to....
      # Batch is currently active or planned
      # If task in not_started, should include
      # If task is in progress/stuck, should include
      # If task is already completed, should ignore

      # facility_id: 5bea7e7eedfdb2c4e1436110
      # {"$match": {"_id": { '$in': product_ids }}},

      # planned_inventories =
      # lookup to item::tx whee ref event_type in material_used or waste
      # pi = Cultivation::Batch.collection.aggregate([
      #   {
      #     "$match": {
      #       '$and': [
      #         status: { '$in': [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE] },
      #         facility_id: facility_id
      #       ]
      #     }
      #   },
      #   { "$lookup": {from: 'cultivation_tasks', localField: '_id', foreignField: 'batch_id', as: 'tasks' } },
      #   { '$unwind': { 'path': '$tasks', 'preserveNullAndEmptyArrays': false }},
      #   { '$unwind': { 'path': '$tasks.material_use', 'preserveNullAndEmptyArrays': false }},
      #   { "$lookup": {from: 'inventory_item_transactions', localField: 'ref_id', foreignField: 'tasks.material_use._id', as: 'material_use' } },
      #   {
      #     '$project': {
      #       name: '$name',
      #       batch_id: '$_id',
      #       tasks: '$tasks',
      #       material_use: '$tasks.material_use',
      #       material_use_id: '$tasks.material_use._id',
      #       product: '$tasks.material_use.product_id',
      #       material_use: '$material_use'
      #     }
      #   },
      #   { "$lookup": {from: 'inventory_products', localField: '_id', foreignField: 'product', as: 'products' } }
      # ])

      # pi = Cultivation::Batch.collection.aggregate([
      #   {
      #     "$match": { status: { '$in': [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE] } }
      #   },
      #   { "$lookup": {from: 'cultivation_tasks', localField: '_id', foreignField: 'cultivation_batch_id', as: 'tasks' } },
      #   { '$unwind': { 'path': '$tasks', 'preserveNullAndEmptyArrays': false }},
      #   { '$unwind': { 'path': '$tasks.material_use', 'preserveNullAndEmptyArrays': false }},
      #   { "$lookup": {from: 'products', localField: '_id', foreignField: 'product_id', as: 'products' } },
      #   { '$unwind': { 'path': '$products', 'preserveNullAndEmptyArrays': false }},
      #   {
      #     '$project': {
      #       p: '$product._id',
      #       p_name: '$product.name',
      #       name: '$name',
      #       batch_id: '$_id'
      #     }
      #   }
      # ])
      # { '$unwind': { 'path': '$tasks1', 'preserveNullAndEmptyArrays': true }},

      # BEST SO FAR
      batch_ids = Cultivation::Batch.where(
        status: {'$in': [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE]},
      ).
        pluck(:id)

      pi5 = Cultivation::Task.collection.aggregate([
        {"$match": {batch_id: {'$in': batch_ids}}},
        {'$unwind': {'path': '$material_use', 'preserveNullAndEmptyArrays': false}},
        {"$lookup": {from: 'inventory_item_transactions', localField: 'material_use._id', foreignField: 'ref_id', as: 'tx'}},
        {
          '$project': {
            id: '$_id',
            tasks: '$name',
            material_use_id: '$material_use._id',
            product_id: '$material_use.product_id',
            planned: '$material_use.quantity',
            used_quantity: '$tx.common_quantity',
          },
        },
        '$project': {
          id: '$id',
          tasks: '$tasks',
          material_use_id: '$material_use_id',
          product_id: '$product_id',
          planned: '$planned',
          sum_used_quantity: {
            '$reduce': {
              input: '$used_quantity',
              initialValue: 0,
              in: {'$add': ['$$value', {'$toDecimal': '$$this'}]},
            },
          },
        },
      ])

      # Next in the aggregation pipeline
      # Add if condition and take the largest number between planned * used
      # Then group data by product_id

      available_inventories
    end
  end
end

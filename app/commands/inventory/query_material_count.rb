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
        {"$match": {"_id": {'$in': product_ids}}},
        {"$lookup": {from: 'inventory_item_transactions', localField: '_id', foreignField: 'product_id', as: 'tx'}},
        {'$unwind': {'path': '$tx', 'preserveNullAndEmptyArrays': false}},
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
      # pi = Cultivation::Batch.collection.aggregate([
      #   {
      #     "$match": {
      #       status: { '$in': [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE] },
      #       facility: { "_id": facility_id }
      #     }
      #   },

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

      # pi = Cultivation::Batch.collection.aggregate([
      #   { "$lookup": { from: 'cultivation_tasks', localField: '_id', foreignField: 'cultivation_batch_id', as: 'tasks' } },
      #   {
      #     '$project': {
      #       name: '$name',
      #       batch_id: '$_id',
      #       tasks: '$tasks.name'
      #     }
      #   }
      # ])

      available_inventories
    end
  end
end

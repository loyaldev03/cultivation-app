module Cultivation
  class ValidateRawMaterial
    prepend SimpleCommand

    attr_reader :batch_id, :facility_id, :user

    def initialize(batch_id, facility_id, current_user)
      @batch_id = batch_id.to_bson_id
      @facility_id = facility_id.to_bson_id
      @user = current_user
    end

    def call
      product_ids = extract_product_ids(batch_id)
      result = Inventory::QueryMaterialCount.call(product_ids, facility_id, user).result

      result.each do |item|
        product_result = item[1]
        if !product_result[:is_available]
          errors.add(
            :material_use,
            "#{product_result[:name]} is short by #{product_result[:available].abs}#{product_result[:common_uom]}"
          )
        end
      end
      result
    end

    def inadequate_products
      result.values.select { |x| x[:is_available] == false }
    end

    private

    def extract_product_ids(batch_id)
      result = Cultivation::Batch.collection.aggregate([
        {"$match": {"_id": batch_id}},
        {"$lookup": {"from": 'cultivation_tasks', "localField": '_id', "foreignField": 'batch_id', "as": 'tasks'}},
        {"$unwind": {"path": '$tasks', "preserveNullAndEmptyArrays": true}},
        {"$unwind": {"path": '$tasks.material_use', "preserveNullAndEmptyArrays": false}},
        {"$group": {"_id": nil, "product_ids": {"$addToSet": '$tasks.material_use.product_id'}}},
      ])

      if result.count == 0
        []
      else
        result.first[:product_ids]
      end
    end
  end
end

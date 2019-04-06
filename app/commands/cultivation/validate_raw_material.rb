module Cultivation
  class ValidateRawMaterial
    prepend SimpleCommand

    attr_reader :args, :batch_id, :facility_id, :user

    def initialize(args = {})
      @args = args
      @batch_id = args[:batch_id].to_bson_id
      @facility_id = args[:facility_id].to_bson_id
      @user = args[:current_user].id
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

      result.first[:product_ids]
    end

    # TODO: Should be another service
    def create_issues
      inadequate_products.each do |product|
        issue = Issues::Issue.find_or_initialize_by(
          task_id: task.id,
          cultivation_batch_id: batch.id.to_s,
          title: "Insufficient Raw Material #{material&.product&.name}",
        )
        issue.issue_no = Issues::Issue.count + 1
        issue.title = "Insufficient Raw Material #{material&.product&.name}"
        issue.description = "Insufficient Raw Material #{material&.product&.name}"
        issue.severity = 'severe'
        issue.issue_type = 'task_from_batch'
        issue.status = 'open'
        # issue.task_id = task.id # ....
        issue.cultivation_batch_id = batch_id
        issue.reported_by = user

        issue.save!
      end
    rescue
      Rails.logger.debug "#{$!.message}"
      errors.add(:error, $!.message)
    end
  end
end

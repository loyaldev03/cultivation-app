module Cultivation
  class ValidateSeed
    prepend SimpleCommand

    attr_reader :args

    def initialize(args = {})
      @args = args
    end

    def call
      save_record
    end

    private

    def save_record
      batch = Cultivation::Batch.find(args[:batch_id])
      catalogue_id = Inventory::Catalogue.seed.id
      products = Inventory::Product.in(catalogue: catalogue_id).where(facility_id: batch.facility_id)

      tasks = batch.tasks
      plant_task = tasks.detect { |a| a['indelible'] == 'plants' }
      #check purchase clone is selected or not
      if plant_task and plant_task.material_use.count == 0
        #if no material is selected
        issue = Issues::Issue.find_by(
          task_id: plant_task.id,
          cultivation_batch_id: batch.id.to_s,
          reported_by: args[:current_user].id,
        )
        #create issue
        unless issue and issue.persisted?
          issue = Issues::Issue
            .create!(
              issue_no: Issues::Issue.count + 1,
              title: 'Seed is not selected',
              description: 'Seed is not selected',
              severity: 'severe',
              issue_type: 'task_from_batch',
              status: 'open',
              task_id: plant_task.id,
              cultivation_batch_id: batch.id.to_s,
              reported_by: args[:current_user].id,
            )
        end
        errors.add('strain', 'Seed is not selected')
      else
        batches_selected = Cultivation::Batch
          .where(:start_date.gte => Time.now)
          .where(:status.in => [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE])
          .not_in(id: batch.id) #not draft => schedule and active

        plant_task.material_use.each do |material|
          result = Inventory::QueryAvailableMaterial.call(material.product_id, batches_selected.pluck(:id)).result

          remaining_material = result[:material_available] - result[:material_booked]
          Rails.logger.debug "Remaining Material ==> #{remaining_material}"
          Rails.logger.debug "Material Needed ==> #{material.quantity}"
          if remaining_material < material.quantity
            issue = Issues::Issue.find_or_initialize_by(
              task_id: plant_task.id,
              cultivation_batch_id: batch.id.to_s,
              title: "Insufficient Seed #{material&.product&.name}",
            )

            issue.issue_no = Issues::Issue.count + 1
            issue.title = "Insufficient Seed #{material&.product&.name}"
            issue.description = "Insufficient Seed #{material&.product&.name}"
            issue.severity = 'severe'
            issue.issue_type = 'task_from_batch'
            issue.status = 'open'
            issue.task_id = plant_task.id
            issue.cultivation_batch_id = batch.id.to_s
            issue.reported_by = args[:current_user].id

            issue.save

            errors.add('strain', "Insufficient Seed #{material&.product&.name}")
          end
        end
      end
    rescue
      Rails.logger.debug "#{$!.message}"
      errors.add(:error, $!.message)
    end
  end
end

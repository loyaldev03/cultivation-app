module Cultivation
  class ValidatePurchaseClone
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
      catalogue_id = Inventory::Catalogue.purchased_clones.id
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
              title: 'Purchase Clone is not selected',
              description: 'Purchase Clone is not selected',
              severity: 'severe',
              issue_type: 'task_from_batch',
              status: 'open',
              task_id: plant_task.id,
              cultivation_batch_id: batch.id.to_s,
              reported_by: args[:current_user].id,
            )
        end
        errors.add('strain', 'Purchase Clone is not selected')
      else
        batches_selected = Cultivation::Batch.where(:start_date.gte => Time.now).not_in(id: batch.id)

        plant_task.material_use.each do |material|
          result = Inventory::QueryAvailableMaterial.call(material.product_id, batches_selected.pluck(:id)).result

          remaining_material = result[:material_available] - result[:material_booked]
          Rails.logger.debug "Available Material => #{result}"
          unless remaining_material >= material.quantity
            issue = Issues::Issue.find_by(
              task_id: plant_task.id,
              cultivation_batch_id: batch.id.to_s,
              reported_by: args[:current_user].id,
              title: "Insufficient Purchase Clone #{material&.product&.name}",
            )
            #create issue if issue doesnt exist
            unless issue and issue.persisted?
              issue = Issues::Issue
                .create!(
                  issue_no: Issues::Issue.count + 1,
                  title: "Insufficient Purchase Clone #{material&.product&.name}",
                  description: "Insufficient Purchase Clone #{material&.product&.name}",
                  severity: 'severe',
                  issue_type: 'task_from_batch',
                  status: 'open',
                  task_id: plant_task.id,
                  cultivation_batch_id: batch.id.to_s,
                  reported_by: args[:current_user].id,
                )
            end

            errors.add('strain', "Insufficient Purchase Clone #{material&.product&.name}")
          end
        end
      end
    rescue
      Rails.logger.debug "#{$!.message}"
      errors.add(:error, $!.message)
    end
  end
end

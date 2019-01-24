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
      end
      #compare for all batches that doesnt started yet

      #create issue clone is not selected
      #check if products > quantity
    rescue
      errors.add(:error, $!.message)
    end
  end
end

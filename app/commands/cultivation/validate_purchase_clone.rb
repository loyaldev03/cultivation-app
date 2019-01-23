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
      if batch.batch_source == 'clones_purchased'
        catalogue_id = Inventory::Catalogue.purchased_clones.id
        products = Inventory::Product.in(catalogue: catalogue_id).where(facility_id: batch.facility_id)

        tasks = batch.tasks
        plant_task = tasks.detect { |a| a['indelible'] == 'plants' }
        #check purchase clone is selected or not
        if plant_task and plant_task.material_use.count == 0
          #create issue
          issue = Issues::Issue.find_or_create_by(
            issue_no: Issues::Issue.count + 1,
            title: 'Purchase Clone is not selected',
            description: 'Purchase Clone is not selected',
            severity: 'severe',
            issue_type: 'task_from_batch',
            task_id: plant_task.id,
            cultivation_batch: batch,
            reported_by: args[:current_user].id,
          )

          errors.add('strain', 'Purchase Clone is not selected')
        end
        #compare for all batches that doesnt started yet

        #create issue clone is not selected
        #check if products > quantity
      end
    rescue
      errors.add(:error, $!.message)
    end
  end
end

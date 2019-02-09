module Cultivation
  class ValidateRawMaterial
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
      material_errors = 0
      tasks = batch.tasks.select { |a| a['indelible'] != 'plants' }

      batches_selected = Cultivation::Batch
        .where(:start_date.gte => Time.now)
        .where(:status.in => [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE])
        .not_in(id: batch.id) #not draft => schedule and active

      tasks.each do |task|
        task.material_use.each do |material|
          result = Inventory::QueryAvailableMaterial.call(material.product_id, batches_selected.pluck(:id)).result

          remaining_material = result[:material_available] - result[:material_booked]
          Rails.logger.debug "Remaining Material ==> #{remaining_material}"
          Rails.logger.debug "Material Needed ==> #{material.quantity}"
          if remaining_material < material.quantity
            material_errors += 1
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
            issue.task_id = task.id
            issue.cultivation_batch_id = batch.id.to_s
            issue.reported_by = args[:current_user].id

            issue.save
          end
        end
      end
      errors.add('strain', 'Insufficient Raw Material') if material_errors > 0
    rescue
      Rails.logger.debug "#{$!.message}"
      errors.add(:error, $!.message)
    end
  end
end

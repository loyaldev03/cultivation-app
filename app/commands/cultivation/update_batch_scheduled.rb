module Cultivation
  class UpdateBatchScheduled
    prepend SimpleCommand

    def initialize(current_user, args = {})
      args = {
        batch_id: nil,      # BSON::ObjectId, Batch.id
        start_date: nil,    # String, Batch Start Date
      }.merge(args)

      @batch_id = args[:batch_id]
      @start_date = args[:start_date]
      @current_user = current_user
    end

    def call
      errors.add(:batch_id, 'batch_id is required') if @batch_id.nil?
      errors.add(:start_date, 'Start Date is required') if @start_date.nil?
      unless @start_date.is_a? String
        errors.add(:start_date, 'Start Date has to be a ISO Date String')
      end
      @start_date = Time.zone.parse(@start_date)
      if errors.empty?
        first_task = Cultivation::Task.find_by(
          batch_id: @batch_id.to_bson_id,
          position: 0,
        )
        args = {
          id: first_task.id,
          start_date: @start_date.beginning_of_day,
        }
        UpdateTask.call(@current_user, args, true)
      end

      validate
    end

    def validate
      batch = Cultivation::Batch.find(@batch_id)

      # validate raw material
      result = ValidateRawMaterial.call(@batch_id, batch.facility_id, @current_user)
      unless result.success?
        errors.add(:batch_id, result.errors[:material_use])
        create_issue_for_material_errors(batch, result.errors[:material_use], @current_user)
      end

      # validate resource
      result = ValidateResource.call(current_user: @current_user, batch_id: @batch_id)
      if result.errors['resource'].present?
        result.errors['resource'].each do |a|
          errors.add(:batch_id, a) unless result.success?
        end
      end
    end

    def create_issue_for_material_errors(batch, errors, reported_by)
      issue = Issues::Issue.find_by(
        title: 'Insufficient materials',
        cultivation_batch_id: batch.id,
        issue_type: 'task_from_batch',
      )

      if issue.present?
        issue.update!(description: errors.join('\n'))
      else
        Issues::SaveIssue.call(reported_by, {
          title: 'Insufficient materials',
          description: errors.join('\n'),
          severity: 'severe',
          cultivation_batch_id: batch.id,
          issue_type: 'task_from_batch',
        })
      end
    end
  end
end

module Cultivation
  class UpdateBatchActivate
    prepend SimpleCommand

    def initialize(args = {})
      args = {
        batch_id: nil,      # BSON::ObjectId, Batch.id
        start_date: nil,    # Batch Start Date
      }.merge(args)

      @batch_id = args[:batch_id]
      @start_date = args[:start_date]
    end

    def call
      errors.add(:batch_id, "batch_id is required") if @batch_id.nil?
      errors.add(:start_date, "Startd Date is required") if @start_date.nil?
      if errors.empty?
        batch = Cultivation::Batch.find_by(id: @batch_id)
        batch.is_active = true
        batch.start_date = @start_date
        batch.save!
        first_task = Cultivation::Task.where(
          batch_id: @batch_id,
          is_phase: true,
          phase: Constants::CONST_CLONE,
        ).first
        first_task.start_date = @start_date
        # Treat this as update to first task's start date
        Cultivation::UpdateTask.call(first_task)
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end
  end
end

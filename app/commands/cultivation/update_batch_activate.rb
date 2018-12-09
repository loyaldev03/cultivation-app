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
      errors.add(:batch_id, 'batch_id is required') if @batch_id.nil?
      errors.add(:start_date, 'Start Date is required') if @start_date.nil?
      if errors.empty?
        batch = Cultivation::Batch.includes(:tasks).find_by(id: @batch_id)
        first_task = batch.tasks.first
        first_task.start_date = @start_date
        first_task.save!
        UpdateTask.call(first_task, true)
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end
  end
end

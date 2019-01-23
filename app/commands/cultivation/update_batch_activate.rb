module Cultivation
  class UpdateBatchActivate
    prepend SimpleCommand

    def initialize(current_user, args = {})
      args = {
        batch_id: nil,      # BSON::ObjectId, Batch.id
        start_date: nil,    # Batch Start Date
      }.merge(args)

      @batch_id = args[:batch_id]
      @start_date = args[:start_date]
      @current_user = current_user
    end

    def call
      errors.add(:batch_id, 'batch_id is required') if @batch_id.nil?
      errors.add(:start_date, 'Start Date is required') if @start_date.nil?
      #validate purchase clone
      result = Cultivation::ValidatePurchaseClone.call(current_user: @current_user, batch_id: @batch_id)
      errors.add(:batch_id, result.errors['strain']) unless result.success?
      #validate seed

      #

      if errors.empty?
        first_task = Cultivation::Task.find_by(
          batch_id: @batch_id.to_bson_id,
          position: 0,
        )
        first_task.start_date = @start_date
        Rails.logger.debug "\033[31m first_task.start_date: #{first_task.start_date} \033[0m"
        UpdateTask.call(@current_user, first_task, true)
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end
  end
end

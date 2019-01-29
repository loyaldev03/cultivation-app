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
    rescue StandardError
      errors.add(:error, $!.message)
    end

    def validate
      batch = Cultivation::Batch.find(@batch_id)
      #validate purchase clone
      if batch.batch_source == 'clones_purchased'
        result = Cultivation::ValidatePurchaseClone.call(current_user: @current_user, batch_id: @batch_id)
        errors.add(:batch_id, result.errors['strain']) unless result.success?
      end

      # validate seed
      if batch.batch_source == 'seeds'
        result = Cultivation::ValidateSeed.call(current_user: @current_user, batch_id: @batch_id)
        errors.add(:batch_id, result.errors['strain']) unless result.success?
      end
    end
  end
end

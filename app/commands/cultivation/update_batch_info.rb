module Cultivation
  class UpdateBatchInfo
    prepend SimpleCommand

    def initialize(current_user, batch_id, args = {})
      @args = args
      @current_user = current_user
      @batch_id = batch_id
    end

    def call
      @batch = Cultivation::Batch.find(@batch_id)
      if @batch.present? && validate?
        @batch.name = @args[:name]
        if @args[:selected_plants].present?
          selected_plants = @args[:selected_plants].map do |p|
            {
              plant_id: p[:plant_id].to_bson_id,
              quantity: p[:quantity].to_i,
            }
          end
          @batch.selected_plants = selected_plants
        end
        if @args[:start_date].present? #update start_date of batch, update first task
          @batch.start_date = @args[:start_date]
          task = @batch.tasks.first
          task_args = {
            id: task.id,
            start_date: @args[:start_date],
          }
          UpdateTask.call(@current_user, task_args, false)
        end
        if @args[:selected_location].present?
          @batch.selected_location = @args[:selected_location].to_bson_id
        end
        @batch.save!
      end
    rescue StandardError
      errors.add(:error, $!.message)
    end

    def validate?
      @current_user.present?
    end
  end
end

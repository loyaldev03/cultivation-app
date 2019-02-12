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

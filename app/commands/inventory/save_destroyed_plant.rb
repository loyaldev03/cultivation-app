module Inventory
  class SaveDestroyedPlant
    prepend SimpleCommand

    DestroyedPlant = Struct.new(:plant_id, :destroyed_date, :destroyed_reason)

    attr_reader :current_user, :batch_id, :plant_id, :destroyed_reason

    def initialize(current_user, args = {})
      args = {
        batch_id: nil,
        plant_id: nil,
        destroyed_reason: '',
      }.merge(args)
      @current_user = current_user
      @batch_id = args[:batch_id]
      @plant_id = args[:plant_id]
      @destroyed_reason = args[:destroyed_reason]
    end

    def call
      Rails.logger.debug "\033[31m 11 \033[0m"
      if valid_params?
        Rails.logger.debug "\033[31m 22 \033[0m"
        plant.destroyed_date = Time.current
        plant.destroyed_reason = destroyed_reason
        plant.modifier = current_user
        plant.save!
        DestroyedPlant.new(
          plant.plant_id,
          plant.destroyed_date,
          plant.destroyed_reason,
        )
      end
    end

    private

    def plant
      @plant ||= Inventory::Plant.find_by(
        cultivation_batch_id: batch_id,
        plant_id: plant_id,
      )
    end

    def valid_params?
      if current_user.nil?
        errors.add(:current_user, 'current_user is required')
      end
      if plant_id.nil?
        errors.add(:plant_id, 'plant_id is required')
      end
      if plant.nil?
        errors.add(:plant_id, 'Invalid plant_id')
        # elsif plant.destroyed_date.present?
        #   errors.add(:plant_id, 'Plant already destroyed')
      end
      errors.empty?
    end
  end
end

module Inventory
  class SaveDestroyedPlant
    prepend SimpleCommand

    DestroyedPlant = Struct.new(:plant_tag, :destroyed_date, :destroyed_reason)

    attr_reader :current_user, :batch_id, :plant_tag, :destroyed_reason

    def initialize(current_user, args = {})
      args = {
        batch_id: nil,
        plant_tag: nil,
        destroyed_reason: '',
      }.merge(args)
      @current_user = current_user
      @batch_id = args[:batch_id]
      @plant_tag = args[:plant_tag]
      @destroyed_reason = args[:destroyed_reason]
    end

    def call
      if valid_params?
        plant.destroyed_date = Time.current
        plant.destroyed_reason = destroyed_reason
        plant.modifier = current_user
        plant.save!
        update_destroyed_plants_count
        update_metrc_destroy_plant
        update_tag_disposed
        update_batch_destroyed_plant_count
        DestroyedPlant.new(
          plant.plant_tag,
          plant.destroyed_date,
          plant.destroyed_reason,
        )
      end
    end

    private

    def update_destroyed_plants_count
      cmd = Inventory::QueryDestroyedPlants.call(batch_id: batch_id)
      if cmd.success?
        Cultivation::Batch.
          where(id: batch_id).
          update(destroyed_plants_count: cmd.result.size)
      end
    end

    def plant
      @plant ||= Inventory::Plant.find_by(
        plant_tag: plant_tag,
      )
    end

    def update_metrc_destroy_plant
      if plant.present?
        MetrcDestroyImmaturePlant.perform_async plant.id.to_s
      end
    end

    def update_tag_disposed
      if plant.present?
        metrc_tag = Inventory::MetrcTag.find_by(tag: plant.plant_tag)
        metrc_tag.update(status: 'disposed')
      end
    end

    def update_batch_destroyed_plant_count
      if plant.present?
        batch = plant.batch
        if batch.present?
          batch.update(destroyed_plants_count: batch.destroyed_plants_count + 1)
        end
      end
    end

    def valid_params?
      if current_user.nil?
        errors.add(:current_user, 'current_user is required')
      end
      if plant_tag.nil?
        errors.add(:plant_tag, 'plant_tag is required')
      end
      if plant.nil?
        errors.add(:plant_tag, 'Invalid plant_tag')
        # elsif plant.destroyed_date.present?
        #   errors.add(:plant_id, 'Plant already destroyed')
      end
      errors.empty?
    end
  end
end

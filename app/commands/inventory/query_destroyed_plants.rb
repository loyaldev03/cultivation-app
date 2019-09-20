module Inventory
  class QueryDestroyedPlants
    prepend SimpleCommand

    DestroyedPlant = Struct.new(:plant_id, :plant_tag, :destroyed_date, :destroyed_reason)

    attr_reader :batch_id

    def initialize(args = {})
      args = {
        batch_id: nil, # BSON::ObjectId, Batch.id - Batch to query
      }.merge(args)
      @batch_id = args[:batch_id]
    end

    def call
      batch = Cultivation::Batch.find(batch_id) rescue nil
      if batch.present?
        plants = Inventory::Plant.
          where(cultivation_batch_id: batch_id).
          not.where(destroyed_date: nil)
      else
        plants = Inventory::Plant.
          not.where(destroyed_date: nil)
      end

      plants.map do |p|
        DestroyedPlant.new(p.plant_id, p.plant_tag, p.destroyed_date, p.destroyed_reason)
      end
    end

    private

    def valid_params?
      if batch_id.nil?
        errors.add(:batch_id, 'batch_id is required')
      end
    end
  end
end

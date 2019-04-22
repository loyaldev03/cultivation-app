module Inventory
  class QueryDestroyedPlants
    prepend SimpleCommand

    DestroyedPlant = Struct.new(:plant_id, :destroyed_date, :destroyed_reason)

    attr_reader :batch_id

    def initialize(args = {})
      args = {
        batch_id: nil, # BSON::ObjectId, Batch.id - Batch to query
      }.merge(args)
      @batch_id = args[:batch_id]
    end

    def call
      plants = Inventory::Plant.
        where(cultivation_batch_id: batch_id).
        not.where(destroyed_date: nil)
      plants.map do |p|
        DestroyedPlant.new(p.plant_id, p.destroyed_date, p.destroyed_reason)
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

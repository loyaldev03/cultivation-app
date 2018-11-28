module Inventory
  class QueryPlants
    prepend SimpleCommand

    def initialize(args = {})
      args = {
        batch_id: nil, # BSON::ObjectId, Batch.id - Batch to query
        growth_stages: [], # Growth stages to return (e.g. [:clone, :veg1])
      }.merge(args)

      @batch_id = args[:batch_id]
      @growth_stages = args[:growth_stages]
    end

    def call
      plants = Inventory::Plant

      if @batch_id
        plants = plants.where(cultivation_batch_id: @batch_id)
      end

      if @growth_stages &&
         (@growth_stages.is_a? Array) &&
         !@growth_stages.empty?
        plants = plants.where(:current_growth_stage.in => @growth_stages)
      end
      plants
    end
  end
end

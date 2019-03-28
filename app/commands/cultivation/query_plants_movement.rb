module Cultivation
  PlantMovement = Struct.new(:id, :quantity, :selected_plants)
  SelectedPlant = Struct.new(:plant_id,
                             :quantity,
                             :plant_code,
                             :plant_location)

  class QueryPlantsMovement
    prepend SimpleCommand

    attr_reader :current_user, :args

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = {
        batch_id: nil,
        task_id: nil,
      }.merge(args)
    end

    def call
      if valid_params?
        # criteria = Cultivation::Batch.collection.aggregate [
        #   {"$match": {_id: args[:batch_id].to_bson_id}},
        #   {
        #     "$project": {
        #       _id: 1,
        #       quantity: 1,
        #       selected_plants: 1,
        #     },
        #   },
        criteria = Cultivation::Batch.collection.aggregate([
          {"$match": {_id: args[:batch_id].to_bson_id}},
          {"$unwind": '$selected_plants'},
          {"$lookup": {
            from: 'inventory_plants',
            localField: 'selected_plants.plant_id',
            foreignField: '_id',
            as: 'plant',
          }},
          {"$unwind": '$plant'},
          {"$group": {
            _id: {
              batch_id: '$_id',
              batch_quantity: '$quantity',
            },
            selected_plants: {
              "$push": {
                plant_id: '$selected_plants.plant_id',
                plant_code: '$plant.plant_id',
                plant_location_id: '$plant.location_id',
                quantity: '$selected_plants.quantity',
              },
            },
          }},
          {"$project": {
            _id: '$_id.batch_id',
            quantity: '$_id.batch_quantity',
            selected_plants: 1,
          }},
        ])

        criteria.map do |x|
          plants = x[:selected_plants].map do |y|
            SelectedPlant.new(
              y[:plant_id].to_s,
              y[:quantity] || '',
              y[:plant_code] || '',
              y[:plant_location_id].to_s,
            )
          end
          PlantMovement.new(
            x[:_id].to_s,
            x[:quantity] || '',
            plants
          )
        end || []
      end
    end

    private

    def match_batch
      if args[:batch_id]
        {"$match": {_id: args[:batch_id]}}
      else
        {"$match": {}}
      end
    end

    def valid_params?
      if current_user.nil?
        errors.add(:current_user, 'current_user is required')
      end
      if args[:batch_id].nil?
        errors.add(:batch_id, 'batch_id is required')
      end
      errors.empty?
    end
  end
end

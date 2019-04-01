module Cultivation
  PlantMovement = Struct.new(:id,
                             :quantity,
                             :selected_plants,
                             :movements)
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
      }.merge(args)
    end

    def call
      if valid_params?
        criteria = Cultivation::Batch.collection.aggregate([
          match_batch,
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
          args_project,
        ])
        res = criteria.first
        if res.present?
          plants = if res[:selected_plants]
                     res[:selected_plants].map do |y|
                       SelectedPlant.new(
                         y[:plant_id],
                         y[:quantity] || '',
                         y[:plant_code] || '',
                         y[:plant_location_id],
                       )
                     end
                   else
                     []
                   end
          movements = if args[:phase] && args[:activity]
                        Cultivation::PlantMovementHistory.where(
                          batch_id: args[:batch_id],
                          phase: args[:phase],
                          activity: args[:activity],
                        )
                      else
                        []
                      end
          PlantMovement.new(
            res[:_id],
            res[:quantity] || '',
            plants,
            movements,
          )
        end
      end
    end

    private

    def args_project
      project = {
        "$project": {
          _id: '$_id.batch_id',
          quantity: '$_id.batch_quantity',
        },
      }
      project[:$project][:selected_plants] = 1 # if args[:selected_plants] == '1'
      project
    end

    def match_batch
      if args[:batch_id]
        {"$match": {_id: args[:batch_id].to_bson_id}}
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

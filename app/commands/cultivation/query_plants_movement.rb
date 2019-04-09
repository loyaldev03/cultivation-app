module Cultivation
  PlantMovement = Struct.new(:id,
                             :quantity,
                             :selected_plants,
                             :selected_trays,
                             :movements)
  SelectedPlant = Struct.new(:plant_id,
                             :quantity,
                             :plant_code,
                             :plant_location)
  TrayLocation = Struct.new(:tray_id,
                            :tray_code,
                            :capacity)

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
        res = if args[:selected_plants] == '1'
                query_with_selected_plants.first
              elsif args[:selected_trays] == '1'
                query_with_selected_trays.first
              else
                {}
              end
        if res.present?
          plants = get_selected_plants_from_result(res)
          trays = get_selected_trays_from_result(res)
          movements = get_movements_by_phase_activity
          PlantMovement.new(
            res[:_id],
            res[:quantity] || '',
            plants,
            trays,
            movements,
          )
        end
      end
    end

    private

    def locations
      @batch ||= Cultivation::Batch.find(args[:batch_id])
      @locations ||= QueryLocations.call(@batch.facility_id).result
    end

    # TODO::REFACTOR#001
    def get_location_code(location_id)
      res = locations.detect { |x| x[:room_id] == location_id }
      if res.present?
        return res[:room_full_code]
      end

      res = locations.detect { |x| x[:section_id] == location_id }
      if res.present?
        return res[:section_full_code]
      end

      res = locations.detect { |x| x[:row_id] == location_id }
      if res.present?
        return res[:row_full_code]
      end

      res = locations.detect { |x| x[:shelf_id] == location_id }
      if res.present?
        return res[:shelf_full_code]
      end

      res = locations.detect { |x| x[:tray_id] == location_id }
      if res.present?
        return res[:tray_full_code]
      end
    end

    def get_selected_plants_from_result(res)
      if res[:selected_plants].present?
        res[:selected_plants].map do |y|
          SelectedPlant.new(
            y[:plant_id],
            y[:quantity] || '',
            y[:plant_code] || '',
            get_location_code(y[:plant_location_id]),
          )
        end
      else
        []
      end
    end

    def get_selected_trays_from_result(res)
      if res[:tray_plan].present?
        res[:tray_plan].map do |t|
          TrayLocation.new(
            t[:tray_id],
            get_location_code(t[:tray_id]),
            t[:capacity],
          )
        end
      else
        []
      end
    end

    def get_movements_by_phase_activity
      if args[:phase] && args[:activity]
        Cultivation::PlantMovementHistory.where(
          batch_id: args[:batch_id],
          phase: args[:phase],
          activity: args[:activity],
        )
      else
        []
      end
    end

    def query_with_selected_plants
      Cultivation::Batch.collection.aggregate([
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
        {"$project": {
          _id: '$_id.batch_id',
          quantity: '$_id.batch_quantity',
          selected_plants: 1,
        }},
      ])
    end

    def query_with_selected_trays
      Cultivation::Batch.collection.aggregate(
        [
          match_batch,
          {"$project": {"quantity": 1}},
          {
            "$lookup": {
              "from": 'cultivation_tray_plans',
              "let": {"batchId": '$_id', "phase": args[:phase]},
              "pipeline": [
                {
                  "$match": {
                    "$expr": {
                      "$and": [
                        {"$eq": ['$batch_id', '$$batchId']},
                        {"$eq": ['$phase', '$$phase']},
                      ],
                    },
                  },
                },
              ],
              "as": 'tray_plan',
            },
          },
          {
            "$project": {
              "_id": 1,
              "quantity": 1,
              "tray_plan": {
                "$map": {
                  "input": '$tray_plan',
                  "as": 'tray_plan',
                  "in": {
                    "_id": '$$tray_plan._id',
                    "tray_id": '$$tray_plan.tray_id',
                    "capacity": '$$tray_plan.capacity',
                  },
                },
              },
            },
          },
        ],
      )
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

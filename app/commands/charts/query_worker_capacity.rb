module Charts
  class QueryWorkerCapacity
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      result = Cultivation::Task.collection.aggregate([
        {"$match": {"batch_id": @args[:batch_id].to_bson_id}},
        {"$lookup": {
          from: 'cultivation_time_logs',
          localField: '_id',
          foreignField: 'task_id',
          as: 'time_logs',
        }},
        {"$lookup": {
          from: 'users',
          localField: 'user_ids',
          foreignField: '_id',
          as: 'users',
        }},

        {"$addFields": {"time_log_count": {"$cond": {"if": {"$gt": [{"$size": '$time_logs'}, 0]}, "then": 1, "else": 0}}}},
        {"$addFields": {"user_id_count": {"$size": {"$ifNull": ['$user_ids', []]}}}},
        {"$group": {
          "_id": '$phase',
          "stage": {"$first": '$phase'},
          "needed": {"$sum": '$user_id_count'},
          "actual": {"$sum": '$time_log_count'},
          "actualColor": {"$first": '#f86822'},
          "neededColor": {"$first": '#4a65b3'},
        }},
      ]).to_a

      phases = Constants::FACILITY_ROOMS_ORDER
      grow_phases = Common::GrowPhase.collection.aggregate([
        {"$project": {
          "name": 1,
          "is_active": 1,
        }},
      ]).to_a

      new_array = []
      idx = 1
      phases.each do |phase|
        if active_phase?(grow_phases, phase)
          c = result.find { |b| b['stage'] == phase }
          if c.present?
            c = c.merge({"index": idx})
            new_array << c
          else
            new_array << {
              "actual": 0,
              "needed": 0,
              "stage": phase,
              "actualColor": '#f86822',
              "neededColor": '#4a65b3',
              "index": idx,
            }
          end
          idx += 1
        end
      end

      new_array
    end

    private

    def active_phase?(grow_phases, phase)
      ph = grow_phases.find { |a| a['name'] == phase }
      if ph.present?
        return ph['is_active']
      else
        return false
      end
    end
  end
end

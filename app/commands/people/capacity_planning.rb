module People
  class CapacityPlanning
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      result = capacity_planning_aggregate
      main = []
      Common::Role.all.map do |role|
        user_data = []
        total_capacity = 0
        total_actual = 0
        percentage = 0
        result&.map do |user|
          capacities = 0
          user_percentage = 0
          if user[:roles].include?(role.id) && user[:work_schedules].present?
            range(user[:work_schedules])&.map do |ws|
              if ws[:end_time] and ws[:start_time]
                capacities += ((ws[:end_time] - ws[:start_time]) / 1.hour)
              end
            end
            unless user[:actual] == 0 or capacities == 0
              user_percentage = 100 - (((capacities.to_f - user[:actual].to_f) / capacities.to_f * 100).ceil)
            end
            if user[:actual] > 0 and capacities == 0
              user_percentage = 100
            end
            total_capacity += capacities.round(2)
            total_actual += user[:actual].round(2)
            user_data << {
              first_name: user[:first_name],
              last_name: user[:last_name],
              photo_url: nil,
              actual: user[:actual].round(0),
              capacity: capacities.round(0),
              user_percentage: user_percentage,
              skills: user[:skills] || [],

            }
          end
        end
        unless total_actual == 0 or total_capacity == 0
          percentage = ((total_capacity - total_actual) / total_capacity * 100).ceil
          percentage = 100 if percentage > 100
        end
        main << {
          id: role.id,
          title: role.name,
          color: color_picker,
          capacity: total_capacity.round(0),
          actual: total_actual.round(0),
          percentage: percentage,
          users: user_data,
        }
      end
      main
    end

    private

    def color_picker
      s = rand(0.6..1)
      v = rand(0.7..1)
      hsv_to_rgb(rand, s, v)
    end

    def hsv_to_rgb(h, s, v)
      h_i = (h * 6).to_i
      f = h * 6 - h_i
      p = v * (1 - s)
      q = v * (1 - f * s)
      t = v * (1 - (1 - f) * s)
      r, g, b = v, t, p if h_i == 0
      r, g, b = q, v, p if h_i == 1
      r, g, b = p, v, t if h_i == 2
      r, g, b = p, q, v if h_i == 3
      r, g, b = t, p, v if h_i == 4
      r, g, b = v, p, q if h_i == 5
      r, g, b = v, p, t if h_i == 6
      r, g, b = p, t, q if h_i == 7
      r, g, b = t, q, p if h_i == 8
      "rgb(#{(r * 256).to_i}, #{(g * 256).to_i}, #{(b * 256).to_i})"
    end

    def capacity_planning_aggregate
      f_ids = @args[:facility_id].split(',').map { |x| x.to_bson_id }
      t_ids = Cultivation::Task.in(facility_id: f_ids).pluck(:id)
      User.collection.aggregate([
        {"$match": {"facilities": {"$in": f_ids}}},
        {"$lookup": {from: 'cultivation_time_logs',
                     as: 'time_logs',
                     let: {user_id: '$_id'},
                     pipeline: [
          match_time_logs,
          {"$match": {
            "$expr": {
              "$and": [
                {"$eq": ['$user_id', '$$user_id']},
              ],
            },
          }},
          {"$match": {
            "$expr": {
              "$and": [
                {"$in": ['$task_id', t_ids]},
              ],
            },
          }},
        ]}},
        {"$addFields": {
          "actual": {
            "$sum": {
              "$map": {
                "input": '$time_logs',
                "in": {"$divide": [{"$subtract": ['$$this.end_time', '$$this.start_time']}, 3600000]},
              },
            },

          },
        }},
        {"$project": {
          "email": 1,
          "first_name": 1,
          "last_name": 1,
          "photo_url": '$user.photo_url',
          "roles": 1,
          "skills": 1,
          "actual": 1,
          "work_schedules": 1,
        }},

      ]).to_a
    end

    def range(data)
      date = Time.current
      if (@args[:period] == 'this_week')
        data.select { |ws| ws[:end_time] >= date.beginning_of_week && ws[:start_time] <= date.end_of_week if ws[:end_time].present? && ws[:start_time].present? }
      elsif (@args[:period] == 'this_year')
        data.select { |ws| ws[:end_time] >= date.beginning_of_year && ws[:start_time] <= date.end_of_year if ws[:end_time].present? && ws[:start_time].present? }
      elsif (@args[:period] == 'this_month')
        data.select { |ws| ws[:end_time] >= date.beginning_of_month && ws[:start_time] <= date.end_of_month if ws[:end_time].present? && ws[:start_time].present? }
      else
        data
      end
    end

    def match_time_logs
      date = Time.current
      if ['this_week', 'this_year', 'this_month'].include?(@args[:period])
        if @args[:period] == 'this_week'
          start_date = date.beginning_of_week
          end_date = date.end_of_week
        elsif (@args[:period] == 'this_year')
          start_date = date.beginning_of_year
          end_date = date.end_of_year
        elsif (@args[:period] == 'this_month')
          start_date = date.beginning_of_month
          end_date = date.end_of_month
        end
        {"$match": {
          "$expr": {
            "$or": [
              {"$and": [{"$gte": ['$end_time', start_date]}, {"$lte": ['$start_time', end_date]}]},
              {"$and": [{"$gte": ['$start_time', start_date]}, {"$lte": ['$start_time', end_date]}]},
              {"$and": [{"$lte": ['$start_time', start_date]}, {"$gte": ['$end_time', end_date]}]},
            ],
          },
        }}
      else
        {"$match": {}}
      end
    end
  end
end

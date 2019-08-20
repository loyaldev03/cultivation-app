module People
  class QueryEmployee
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = {
        page: 0,
        limit: 20,
        search: nil,
      }.merge(args)
      @args[:page] = @args[:page].to_i
      @args[:limit] = @args[:limit].to_i
    end

    def call

      # json_array
      result = aggregate_call
      main = []
      data = []
      # manager = nil
      result.to_a[0][:data].map do |user|
        ontime_arrival_data = ontime_arrival(user[:work_schedules], user[:cultivation_time_logs])
        task_on_time_data = task_on_time(user[:tasks_ontime], user[:cultivation_time_logs], user[:_id])
        capacity_hours = capacity_hours(user[:actual_capacity_hours], user[:work_schedules])
        absents = absents(user[:work_schedules])
        ot_hours = ot_hours(user[:cultivation_time_logs])
        manager = User.find(user[:reporting_manager_id]) unless user[:reporting_manager_id].nil?
        roles = Common::Role.find(user[:roles])&.pluck(:name)
        roles&.map do |role|
          data << {
            role_name: role,
            user: "#{user[:first_name]} #{user[:last_name]}",
            photo_url: nil,
            ontime_arrival_data: ontime_arrival_data,
            task_on_time_data: task_on_time_data,
            capacity_hours: capacity_hours,
            absents: absents,
            ot_hours: ot_hours.round(2),
            reported_to: manager.nil? ? manager : "#{manager.first_name} #{manager.last_name}",
          }
        end
      end
      main << {
        data: data,
        metadata: result.to_a[0]['metadata'][0],
      }
      main.first
      # json_array
      # result.to_a[0][:data]
    end

    def aggregate_call
      tcapacity_ids = Cultivation::Task.where(facility_id: @args[:facility_id].to_bson_id).pluck(:id)
      User.collection.aggregate([
        {"$match": {"facilities": {"$all": [@args[:facility_id].to_bson_id]}}},
        match_search,
        #tasks_ontime
        {"$lookup": {from: 'cultivation_tasks',
                     as: 'tasks_ontime',
                     let: {user_id: '$_id'},
                     pipeline: [
          {"$match": {
            "$expr": {
              "$and": [
                {"$eq": ['$facility_id', @args[:facility_id].to_bson_id]},
                {"$eq": ['$work_status', 'done']},
              ],
            },
          }},
        ]}},
        #all time_logs
        {"$lookup": {from: 'cultivation_time_logs',
                     as: 'cultivation_time_logs',
                     let: {user_id: '$_id'},
                     pipeline: [
          {"$match": {
            "$expr": {
              "$and": [
                {"$eq": ['$user_id', '$$user_id']},
              ],
            },
          }},
        ]}},

        #capacity_hours
        {"$lookup": {from: 'cultivation_time_logs',
                     as: 'capacity_hours',
                     let: {user_id: '$_id'},
                     pipeline: [
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
                {"$in": ['$task_id', tcapacity_ids]},
              ],
            },
          }},
        ]}},

        {"$addFields": {
          "actual_capacity_hours": {
            "$sum": {
              "$map": {
                "input": '$capacity_hours',
                "in": {"$divide": [{"$subtract": ['$$this.end_time', '$$this.start_time']}, 3600000]},
              },
            },
          },
        }},
        {"$project": {
          "email": 1,
          "first_name": 1,
          "last_name": 1,
          "photo_data": 1,
          "roles": 1,
          "actual_capacity_hours": 1,
          "work_schedules": 1,
          "tasks_ontime": 1,
          "capacity_hours": 1,
          "cultivation_time_logs": 1,
          "reporting_manager_id": 1,
        }},
        {"$facet": {
          metadata: [
            {"$count": 'total'},
            {"$addFields": {
              page: @args[:page],
              pages: {"$ceil": {"$divide": ['$total', @args[:limit]]}},
              skip: skip,
              limit: @args[:limit],
            }},
          ],
          data: [
            {"$skip": skip},
            {"$limit": @args[:limit]},
          ],
        }},
      ])
    end

    def ontime_arrival(work_schedules, time_logs)
      ontime = 0
      workschedules = work_schedules&.select { |ws| ws[:date] != nil }
      workschedules&.map do |d|
        date = d[:date].to_date
        tl = time_logs.find { |f| f[:start_time] == date }
        dws = Time.zone.parse("#{d[:date].strftime('%Y-%m-%d')} #{d[:start_time].strftime('%H:%M')}")
        if tl.present?
          utl = tl[:start_time]
          if utl <= dws
            ontime += 1
          end
        end
      end
      if ontime != 0
        percentage = (ontime.to_f / work_schedules.count.to_f) * 100
      else
        percentage = 0
      end
      return percentage
    end

    def task_on_time(tasks, time_logs, u_id)
      count = 0
      tc = 0
      tasks&.map do |task|
        timelogs = time_logs&.select { |tl| tl[:task_id] == task[:_id].to_bson_id && tl[:user_id] == u_id.to_bson_id }
        timelogs&.map { |time_log| count += ((time_log[:end_time] - time_log[:start_time]) / 1.hour) }
        if count <= task[:estimated_hours]
          tc += 1
        end
      end
      (100 - ((tasks.count - tc) * 100 / tasks.count).ceil) unless tasks.nil?
    end

    def capacity_hours(actual, work_schedules)
      capacity = 0
      percentage = 0
      work_schedules&.map { |ws| capacity += ((ws[:end_time] - ws[:start_time]) / 1.hour) }
      percentage = ((capacity - actual) / capacity * 100).ceil unless actual == 0 or capacity == 0
      if percentage > 100
        percentage = 100
      elsif percentage < 0
        percentage = 0
      end
      return percentage
    end

    def absents(work_schedules)
      ws = work_schedules&.select { |w| w[:arrival_status] == 'absent' }
      ws.nil? ? 0 : ws.count
    end

    def ot_hours(time_logs)
      ot_hours = 0
      time_logs&.map do |time_log|
        time_log[:breakdowns]&.map { |breakdown| ot_hours += (breakdown[:duration] / 1.hour) if breakdown[:cost_type] == 'OT' }
      end
      ot_hours
    end

    def match_search
      if !@args[:search].blank?
        {"$match": {"first_name": Regexp.new(args[:search], Regexp::IGNORECASE)}}
      else
        {"$match": {}}
      end
    end

    def skip
      @skip ||= (@args[:page] * @args[:limit])
    end
  end
end

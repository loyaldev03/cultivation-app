module People
  class QueryTimesheetApproval
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

    def calljjj
      data = []
      User.all.map do |user|
        data << {email: user.email, data: user.work_schedules&.group_by { |d| (DateTime.parse(d[:start_time].strftime('%Y-%m-%d')).strftime('%W').to_i + 1) }}
      end
      data
    end

    def call
      first_week = CompanyInfo.first.first_day_of_week.downcase[0..2].to_sym
      date = Date.current
      main = []
      data = []
      result = aggregate_query
      result[0][:data]&.map do |user|
        roles = Common::Role.find(user[:roles])&.pluck(:name)
        manager = User.find(user[:reporting_manager_id]) unless user[:reporting_manager_id].nil?
        ws = user[:work_schedules]&.select { |k| k[:start_time] != nil }
        wl = user[:work_logs]&.select { |k| k[:start_time] != nil }
        worklogs = wl.present? ? wl.group_by_week(week_start: first_week) { |d| d[:start_time] } : []
        workschedules = ws.present? ? ws.group_by_week(week_start: first_week) { |d| d[:start_time] } : []

        if (@args[:role].nil?) || (@args[:role] == 'all') || (user[:roles].include?(@args[:role].to_bson_id))
          workschedules&.map do |week, work_schedules|
            if (@args[:status] == 'all') || (work_schedules.first[:timesheet_status] == @args[:status])
              status = work_schedules.first[:timesheet_status]
              wlogs = worklogs&.select { |k, v| k == week }
              wlogs&.map do |weekl, work_logs|
                total_hours = 0
                total_hours += ((work_logs.last[:end_time] - work_logs.first[:start_time]) / 1.hour)
                data << {
                  user_id: user[:_id].to_s,
                  worker_name: "#{user[:first_name]} #{user[:last_name]}",
                  roles: roles.join(','),
                  photo_url: nil,
                  approver: manager.nil? ? manager : "#{manager.first_name} #{manager.last_name}",
                  status: status,
                  week: "#{weekl} - #{weekl + 6} ",
                  total_hours: total_hours.round(2),
                  total_ot: 0,

                }
              end
            end
          end
        end
      end
      main << {
        data: data,
        metadata: result[0]['metadata'][0],
      }
      main.first
      # result[0][:data]
    end

    def aggregate_query
      f_ids = @args[:facility_id].split(',').map { |x| x.to_bson_id }
      User.collection.aggregate([
        {"$match": {"facilities": {"$in": f_ids}}},
        match_search,
        {"$lookup": {from: 'common_work_logs',
                     as: 'work_logs',
                     let: {user_id: '$_id'},
                     pipeline: [
          match_work_logs,
          {"$match": {
            "$expr": {
              "$and": [
                {"$eq": ['$user_id', '$$user_id']},
              ],
            },
          }},
        ]}},

        {"$project": {
          "wl_count": {"$size": '$work_logs'},
          "email": 1,
          "first_name": 1,
          "last_name": 1,
          "photo_data": 1,
          "roles": 1,
          "work_logs": 1,
          "work_schedules": 1,
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
      ]).to_a
    end

    def skip
      @skip ||= (@args[:page] * @args[:limit])
    end

    def match_search
      if !@args[:search].blank?
        {"$match": {"first_name": Regexp.new(args[:search], Regexp::IGNORECASE)}}
      else
        {"$match": {}}
      end
    end

    def match_work_logs
      date = Time.current
      if @args[:range] == 'this_week'
        start_date = date.beginning_of_week
        end_date = date.end_of_week
      else
        start_date = date.beginning_of_year
        end_date = date.end_of_year
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
    end
  end
end

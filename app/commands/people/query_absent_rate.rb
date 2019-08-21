module People
  class QueryAbsentRate
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      absent_rate[:absent_rate]
    end

    private

    def absent_rate
      work_schedules = User.collection.aggregate([
        {
          "$match": {
            "facilities": {"$all": [@args[:facility_id].to_bson_id]},
            "exempt": {"$ne": true},
          },
        },
        {"$lookup": {from: 'time_logs',
                     localField: 'user_id',
                     foreignField: '_id',
                     as: 'time_logs'}},
        {"$unwind": '$work_schedules'},
        {"$match": {"work_schedules.date": {"$gte": @args[:start_date], "$lte": @args[:end_date]}}},

        {"$project": {
          "date": '$work_schedules.date',
          "start_time": '$work_schedules.start_time',
          "end_time": '$work_schedules.end_time',
          "arrival_status": '$work_schedules.arrival_status',
        }},
      ])
      clocked_in_count = work_schedules.count
      expected_work_day = work_schedules.count
      total_absent = work_schedules.select { |a| a['arrival_status'] == 'absent' }.count

      if expected_work_day == 0
        absent_rate = 0
      else
        absent_rate = (total_absent.to_f / expected_work_day.to_f) * 100
      end

      Rails.logger.debug "Arriva status man ==> #{work_schedules.map { |a| a['arrival_status'] }}"
      Rails.logger.debug "expected_work_day #{expected_work_day}"

      Rails.logger.debug "total_absent #{total_absent}"
      {
        clocked_in_count: clocked_in_count,
        total_absent: total_absent,
        expected_work_day: expected_work_day,
        absent_rate: absent_rate.round(2),
      }
    end
  end
end

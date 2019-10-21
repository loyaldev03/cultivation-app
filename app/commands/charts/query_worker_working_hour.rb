module Charts
  class QueryWorkerWorkingHour
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args

      range = args[:range]
      if range == 'daily'
        @st_date = Time.current.beginning_of_week
        @ed_date = Time.current.end_of_week
      elsif range == 'weekly'
        @st_date = Time.current.beginning_of_month
        @ed_date = Time.current.end_of_month
      elsif range == 'monthly'
        @st_date = Time.current.beginning_of_year
        @ed_date = Time.current.end_of_year
      end
    end

    def call
      work_logs = Common::WorkLog.collection.aggregate([
        {"$match": {"user_id": @current_user&.id}},
        {"$match": {"end_time": {"$ne": nil}}},
        match_date,
        subtract_by_range,
        #group_by_range,

        {"$sort": {"_id": 1}},

      ]).to_a
      json_data = []
      grouped_data = []
      if @args[:range] == 'weekly'
        work_logs.each do |w|
          week = {week: "#{w[:start_time].beginning_of_week.strftime('%m/%d/%Y')} - #{w[:start_time].end_of_week.strftime('%m/%d/%Y')}"}
          json_data << w.merge(week)
        end
        json_data.group_by { |x| x[:week] }.each do |week, data|
          grouped_data << {label: week, total_hours: data.sum { |x| x[:totalHourSpent].round(2) }}
        end
      elsif @args[:range] == 'daily'
        work_logs.each do |w|
          grouped_data << {label: w[:start_time].strftime('%b %d'), total_hours: w[:totalHourSpent].round(2)}
        end
      end
      completed_data = {
        hourly_rate: @current_user.hourly_rate,
        type: @args[:range],
        data: grouped_data,
      }

      return completed_data
    end

    def subtract_by_range
      if !@args[:range].present? || @args[:range] == 'daily'
        {
          "$addFields": {
            "dayGroup": {"$dateToString": {
              "date": '$start_time',
              "format": '%d/%m',
            }},
            "totalHourSpent": {
              "$divide": [{
                "$subtract": ['$end_time', '$start_time'],
              }, 3600000],
            },
          },

        }
      elsif @args[:range] == 'weekly'
        {
          "$addFields": {
            "range_number": {"$toString": {"$week": '$start_time'}},
            "range_type": 'Week',
            "weekGroup": {"$dateToString": {
              "date": '$start_time',
              "format": '%U',
            }},
            "totalHourSpent": {
              "$divide": [{
                "$subtract": ['$end_time', '$start_time'],
              }, 3600000],
            },
          },

        }
        # elsif  @args[:range] == "monthly"
        #   {
        #     "$addFields": {
        #       "monthGroup": { "$dateToString": {
        #         "date": '$start_time',
        #         "format": "%m",
        #         }
        #       },
        #       "totalHourSpent": {
        #         "$divide": [{
        #             "$subtract": [ "$end_time", "$start_time" ]
        #             }, 3600000
        #         ]
        #     },
        #     }

        #   }
      end
    end

    def match_date
      if @st_date.present? && @ed_date.present?
        {"$match": {
          "$expr": {
            "$or": [
              {"$and": [{"$gte": ['$end_time', @st_date]}, {"$lte": ['$start_time', @ed_date]}]},
              {"$and": [{"$gte": ['$start_time', @st_date]}, {"$lte": ['$start_time', @ed_date]}]},
              {"$and": [{"$lte": ['$start_time', @st_date]}, {"$gte": ['$end_time', @ed_date]}]},
            ],
          },
        }}
      else
        {'$match': {}}
      end
    end

    # def group_by_range
    #   if !@args[:range].present? || @args[:range] == "daily"
    #       {
    #           "$group": {
    #               _id:  { "$dateToString": {
    #                 "date": '$start_time',
    #                 "format": "%d",
    #                 }
    #               },
    #               label: {"$first": '$dayGroup'},
    #               total_hours: {
    #                   "$sum": {"$trunc": ["$totalHourSpent"]}
    #               },

    #           }

    #       }
    #   elsif  @args[:range] == "weekly"
    #       {
    #           "$group": {
    #               _id: {"$week": '$start_time'},
    #               label: {"$first": {"$concat": ["Week"," ", "$weekGroup"]}},
    #               total_hours: {
    #                   "$sum": {"$trunc": ["$totalHourSpent"]}
    #               },

    #           }

    #       }
    #   elsif  @args[:range] == "monthly"
    #       {
    #           "$group": {
    #               _id: {"$month": '$start_time'},
    #               label: {"$first": {"$concat": ["Month"," ", "$monthGroup"]}},
    #               total_hours: {
    #                   "$sum": { "$trunc": ['$totalHourSpent']}
    #               }
    #           }

    #       }
    #   end
    # end

  end
end

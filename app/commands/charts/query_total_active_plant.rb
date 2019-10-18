module Charts
  class QueryTotalActivePlant
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @period = args[:period]
      @facility_id = @args[:facility_id]
    end

    def call
      Inventory::Plant.collection.aggregate([
        match_period,
        {"$lookup": {
          from: 'inventory_facility_strains',
          localField: 'facility_strain_id',
          foreignField: '_id',
          as: 'facility_strain',
        }},
        {"$unwind": '$facility_strain'},
        {"$match": {"facility_strain.facility_id": {"$in": @facility_id}}},
      ]).to_a.count
    end

    def match_period
      date = Time.zone.now
      if @period == 'this_month'
        start_date = date.beginning_of_month
        end_date = date.end_of_month
      elsif @period == 'this_year'
        start_date = date.beginning_of_year
        end_date = date.end_of_year
      elsif @period == 'this_week'
        start_date = date.beginning_of_week
        end_date = date.end_of_week
      else
        start_date = 'all'
      end

      if start_date == 'all'
        {"$match": {}}
      else
        {"$match": {
          "$expr": {
            "$or": [
              {"$and": [{"$gte": ['$c_at', start_date]}, {"$lte": ['$c_at', end_date]}]},
              {"$and": [{"$gte": ['$c_at', start_date]}, {"$lte": ['$c_at', end_date]}]},
              {"$and": [{"$lte": ['$c_at', start_date]}, {"$gte": ['$c_at', end_date]}]},
            ],
          },
        }}
      end
    end
  end
end

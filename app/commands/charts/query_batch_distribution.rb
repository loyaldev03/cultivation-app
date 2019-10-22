module Charts
  class QueryBatchDistribution
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',')
      date = Time.current

      @range = args[:range].humanize.downcase

      if @range == 'this week'
        @date_st = date.beginning_of_week
        @date_nd = date.end_of_week
      elsif @range == 'this month'
        @date_st = date.beginning_of_month
        @date_nd = date.end_of_month
      elsif @range == 'this year'
        @date_st = date.beginning_of_year
        @date_nd = date.end_of_year
      end
    end

    def call
      get_phases = Common::GrowPhase.where(is_active: true).pluck(:name) - ['mother', 'storage', 'vault']
      ordered_phases = []
      Constants::FACILITY_ROOMS_ORDER.each do |phase|
        ordered_phases << get_phases.detect { |w| w == phase }
      end

      batch_plants = Cultivation::Batch.collection.aggregate([
                                                               match_facility,
                                                               {"$match": {"status": {"$in": [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE]}}},
                                                               {"$match": {"current_growth_stage": {"$in": get_phases}}},
                                                               match_date,
                                                               {"$group": {_id: '$current_growth_stage', phase: {"$first": '$current_growth_stage'}, plant_count: {"$sum": '$quantity'}, batch_count: {"$sum": 1}}},
                                                               {"$project": {
                                                                 "_id": 0,
                                                                 "phase": 1,
                                                                 "plant_count": 1,
                                                                 "batch_count": 1,
                                                               }},
                                                             ])

      json_array = []
      ordered_phases.compact.each do |phase|
        phase_exist = batch_plants.detect { |x| x[:phase] == phase }
        if phase_exist.present?
          json_array << batch_plants.detect { |x| x[:phase] == phase }
        else
          json_array << {
            phase: phase,
            plant_count: 0,
            batch_count: 0,
          }
        end
      end

      all_counts = {
        total_plant: batch_plants.map { |x| x[:plant_count] }.sum,
        total_batches: batch_plants.map { |x| x[:batch_count] }.sum,
        query_batches: json_array.compact,
      }

      all_counts
      #ordered_phases.compact

    end

    def match_facility
      if resource_shared?
        {"$match": {"facility_id": {"$in": @user.facilities}}}
      else
        {"$match": {"facility_id": {"$in": @facility_id.map(&:to_bson_id)}}}
      end
    end

    def match_date
      if @date_st.present? && @date_nd.present?
        {'$match': {'$and': [
          {'c_at': {'$gte': @date_st}},
          {'c_at': {'$lt': @date_nd}},
        ]}}
      else
        {'$match': {}}
      end
    end

    def resource_shared?
      CompanyInfo.last.enable_resouces_sharing
    end

    def active_phase?(phase)
      ph = Common::GrowPhase.find_by(name: phase)
      if ph.present?
        return ph&.is_active
      else
        return false
      end
    end
  end
end

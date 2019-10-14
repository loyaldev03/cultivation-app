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
      active_phases = Constants::FACILITY_ROOMS_ORDER.select { |x| x if Common::GrowPhase.find_by(name: x)&.is_active? } - ['mother', 'storage', 'vault']
      json_array = []

      batch_plants = Cultivation::Batch.collection.aggregate([
        {"$match": {"current_growth_stage": {"$in": active_phases}}},
        match_facility,
        match_date,
        {"$lookup": {from: 'inventory_plants',
                     localField: '_id',
                     foreignField: 'cultivation_batch_id',
                     as: 'plants'}},
        {"$group": {_id: '$current_growth_stage', plant_count: {"$sum": {"$size": '$plants'}}, batch_count: {"$sum": 1}}},

      ])
      batch_plants.each do |plant|
        json_array << {
          phase: plant[:_id],
          batch_count: plant[:batch_count],
          plant_count: plant[:plant_count],
        }
      end
      plants_by_phases = []
      active_phases.each do |phase|
        data = json_array.select { |x| x if x[:phase] == phase }.first
        plants_by_phases << {
          phase: phase,
          batch_count: data.present? ? data[:batch_count] : 0,
          plant_count: data.present? ? data[:plant_count] : 0,
        }
      end

      all_counts = {
        total_plant: plants_by_phases.map { |x| x[:plant_count] }.sum,
        total_batches: plants_by_phases.map { |x| x[:batch_count] }.sum,
        query_batches: plants_by_phases,
      }

      return all_counts
    end

    def match_facility
      if resource_shared?
        {"$match": {"facility_id": {"$in": active_facility_ids}}}
      else
        {"$match": {"facility_id": {"$in": @facility_id.map { |x| x.to_bson_id }}}}
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

    def active_facility_ids
      Facility.where(is_enabled: true).pluck(:id)
    end
  end
end

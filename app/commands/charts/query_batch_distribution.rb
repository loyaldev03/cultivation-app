module Charts
  class QueryBatchDistribution
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id]
    end

    def call
      date = Time.current
      range = @args[:range].humanize.downcase
      batches_with_facility = Cultivation::Batch.where(facility_id: @facility_id)
      phases = Constants::FACILITY_ROOMS_ORDER - ['mother', 'storage', 'vault']
      if (range == 'this week')
        batches = batches_with_facility.where(:created_at.gt => date.beginning_of_week, :created_at.lt => date.end_of_week)
      elsif (range == 'this year')
        batches = batches_with_facility.where(:created_at.gt => date.beginning_of_year, :created_at.lt => date.end_of_year)
      elsif (range == 'this month')
        batches = batches_with_facility.where(:created_at.gt => date.beginning_of_month, :created_at.lt => date.end_of_month)
      else
        batches = batches_with_facility.all
      end
      total_batches = batches_with_facility.in(
        status: [
          Constants::BATCH_STATUS_SCHEDULED,
          Constants::BATCH_STATUS_ACTIVE,
        ],
      )
      json_array = []
      total_batches = 0
      phases.each do |phase|
        batch_phase = batches.select { |a| a.current_growth_stage == phase }
        count = 0
        total_batches += batch_phase.count
        batch_phase.each do |batch|
          count += batch.plants.count
        end
        json_array << {
          phase: phase.capitalize,
          batch_count: batch_phase.count,
          plant_count: count,
        }
      end
      {
        total_plant: Charts::QueryTotalActivePlant.call(@user, {facility_id: @facility_id}).result,
        total_batches: total_batches,
        query_batches: json_array,
      }
    end
  end
end

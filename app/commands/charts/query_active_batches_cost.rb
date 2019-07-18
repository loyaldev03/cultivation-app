module Charts
  class QueryActiveBatchesCost
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      facility = Facility.find(@args[:facility_id])
      batches = Cultivation::Batch.where(facility_id: facility.id.to_s).in(
        status: [
          Constants::BATCH_STATUS_SCHEDULED,
          Constants::BATCH_STATUS_ACTIVE,
        ],
      )
      date = Time.zone.now
      sum_cost = 0
      if (@args[:period] == 'This Week')
        batches = batches.where(:created_at.gt => date.beginning_of_week, :created_at.lt => date.end_of_week)
      elsif (@args[:period] == 'This Year')
        batches = batches.where(:created_at.gt => date.beginning_of_year, :created_at.lt => date.end_of_year)
      elsif (@args[:period] == 'This Month')
        batches = batches.where(:created_at.gt => date.beginning_of_month, :created_at.lt => date.end_of_month)
      else
        batches = batches.all
      end
      batches.each do |batch|
        sum_cost += batch.actual_cost
      end
      sum_cost
      # facility_strain_ids = facility.strains.map { |a| a.id.to_s }
      # plants = Inventory::Plant.where(facility_strain_id: {'$in': facility_strain_ids})
      # plants.count
    end
  end
end

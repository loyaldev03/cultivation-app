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
      sum_cost = 0
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

module Charts
  class QueryTotalYield
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      facility = Facility.find(@args[:facility_id])
      batches = Cultivation::Batch.where(facility_id: facility.id).includes(:harvest_batch)
      batches_sum = 0
      batches.each do |b|
        sum = 0
        b.harvest_batch.each do |harvest|
          sum += harvest.total_cure_weight.present? ? harvest.total_cure_weight : harvest.total_dry_weight
        end
        batches_sum += sum
      end
      batches_sum
    end
  end
end

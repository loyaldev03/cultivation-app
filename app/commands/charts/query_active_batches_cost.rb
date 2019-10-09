module Charts
  class QueryActiveBatchesCost
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @period = args[:period]
    end

    def call
      batches = Cultivation::Batch.where(facility_id: {"$in": @args[:facility_id]}).in(
        status: [
          Constants::BATCH_STATUS_SCHEDULED,
          Constants::BATCH_STATUS_ACTIVE,
        ],
      )
      date = Time.zone.now
      sum_cost = 0
      if (@period.present? && @period == 'this_week')
        batches = batches.where(:created_at.gt => date.beginning_of_week, :created_at.lt => date.end_of_week)
      elsif (@period.present? && @period == 'this_year')
        batches = batches.where(:created_at.gt => date.beginning_of_year, :created_at.lt => date.end_of_year)
      elsif (@period.present? && @period == 'this_month')
        batches = batches.where(:created_at.gt => date.beginning_of_month, :created_at.lt => date.end_of_month)
      else
        batches = batches.all
      end
      batches.each do |batch|
        sum_cost += batch.actual_cost
      end
      sum_cost
    end
  end
end

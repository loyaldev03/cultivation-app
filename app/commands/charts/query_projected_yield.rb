module Charts
  class QueryProjectedYield
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @period = args[:period]
      @facilities = args[:facility_id]
    end

    def call
      batches = Cultivation::Batch.active.where(facility_id: {"$in": @facilities}).includes(:harvest_batch)
      date = Time.zone.now
      batches_sum = 0
      batches.each do |b|
        sum = 0
        if (@period.present? && @period == 'this_week')
          harvest_batches = b.harvest_batch.where(:created_at.gt => date.beginning_of_week, :created_at.lt => date.end_of_week)
        elsif (@period.present? && @period == 'this_year')
          harvest_batches = b.harvest_batch.where(:created_at.gt => date.beginning_of_year, :created_at.lt => date.end_of_year)
        elsif (@period.present? && @period == 'this_month')
          harvest_batches = b.harvest_batch.where(:created_at.gt => date.beginning_of_month, :created_at.lt => date.end_of_month)
        else
          harvest_batches = b.harvest_batch.all
        end
        harvest_batches.each do |harvest|
          sum += harvest.total_cure_weight.present? ? harvest.total_cure_weight : harvest.total_dry_weight
        end
        batches_sum += sum
      end
      batches_sum
    end
  end
end

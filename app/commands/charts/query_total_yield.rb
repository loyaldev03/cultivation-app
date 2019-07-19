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
      date = Time.zone.now
      batches_sum = 0
      batches.each do |b|
        sum = 0
        if (@args[:period] == 'This Week')
          harvest_batches = b.harvest_batch.where(:created_at.gt => date.beginning_of_week, :created_at.lt => date.end_of_week)
        elsif (@args[:period] == 'This Year')
          harvest_batches = b.harvest_batch.where(:created_at.gt => date.beginning_of_year, :created_at.lt => date.end_of_year)
        elsif (@args[:period] == 'This Month')
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

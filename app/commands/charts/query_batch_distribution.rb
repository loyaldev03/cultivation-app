module Charts
  class QueryBatchDistribution
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      date = Date.parse("#{@args[:date]}")
      phases = Common::GrowPhase.all.pluck(:name)
      if (@args[:label] == 'This Week')
        batches = Cultivation::Batch.where(:created_at.gt => date.beginning_of_week, :created_at.lt => date.end_of_week)
      elsif (@args[:label] == 'This Year')
        batches = Cultivation::Batch.where(:created_at.gt => date.beginning_of_year, :created_at.lt => date.end_of_year)
      elsif (@args[:label] == 'This Month')
        batches = Cultivation::Batch.where(:created_at.gt => date.beginning_of_month, :created_at.lt => date.end_of_month)
      else
        batches = Cultivation::Batch.all
      end
      json_array = []
      phases.each do |phase|
        batch_phase = batches.select { |a| a.current_growth_stage == phase.downcase }
        count = 0
        batch_phase.each do |batch|
          count += batch.plants.count
        end
        json_array << {
          phase: phase,
          batch_count: batch_phase.count,
          plant_count: count,
        }
      end
      json_array
    end
  end
end

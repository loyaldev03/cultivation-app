module Charts
  class QueryBatchDistribution
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      phases = Common::GrowPhase.all.pluck(:name)
      batches = Cultivation::Batch.all
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

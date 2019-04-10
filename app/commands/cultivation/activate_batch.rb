module Cultivation
  class ActivateBatch
    prepend SimpleCommand

    attr_reader :args

    def initialize
      @batches = Cultivation::Batch.
        includes(:facility).
        where(:status.in => [Constants::BATCH_STATUS_SCHEDULED])
    end

    def call
      @batches.each do |batch|
        Time.use_zone(batch.facility.timezone) do
          update_status(batch)
          update_current_growth_stage(batch)
        end
      end
    end

    private

    def update_status(batch)
      # Activate batch by changing it's status to active
      if batch.start_date.past?
        batch.update(status: Constants::BATCH_STATUS_ACTIVE)
      end
    end

    def update_current_growth_stage(batch)
      # Update batch current grow stage
      growth_stages = batch.facility.growth_stages
      phases = Cultivation::QueryBatchPhases.call(
        batch,
        growth_stages,
      ).result
    end
  end
end

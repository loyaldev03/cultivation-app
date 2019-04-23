module Cultivation
  class ActivateBatch
    prepend SimpleCommand

    attr_reader :current_time

    def initialize(current_time)
      if current_time.is_a?(Time)
        @current_time = current_time
      else
        raise "Expected current_time to be of type 'Time'"
      end
    end

    def call
      @batches = Cultivation::Batch.
        includes(:facility).
        where(status: Constants::BATCH_STATUS_SCHEDULED)
      @batches.each do |batch|
        Time.use_zone(batch.facility.timezone) do
          update_status(batch)
        end
      end

      @active_batches = Cultivation::Batch.
        includes(:facility).
        where(status: Constants::BATCH_STATUS_ACTIVE)
      @active_batches.each do |batch|
        Time.use_zone(batch.facility.timezone) do
          update_current_growth_stage(batch)
          update_plants_current_growth_stage(batch)
        end
      end
    end

    private

    def update_status(batch)
      # Activate batch by changing it's status to active
      if current_time >= batch.start_date
        batch.update(status: Constants::BATCH_STATUS_ACTIVE)
      end
    end

    def update_current_growth_stage(batch)
      if batch.status == Constants::BATCH_STATUS_ACTIVE
        schedules = Cultivation::QueryBatchPhases.call(batch).grouping_schedules
        if schedules.present?
          phases = schedules.pluck(:phase)
          current_phase = schedules.detect { |p| p.start_date >= current_time }
          if current_phase.present?
            prev = phases.index(batch.current_growth_stage)
            curr = phases.index(current_phase.phase)
            if prev && curr && prev < curr
              batch.update(current_growth_stage: current_phase.phase)
            end
          end
        end
      end
    end

    def update_plants_current_growth_stage(batch)
      MovePlantsToNextPhaseJob.perform_later(batch.id.to_s)
    end
  end
end

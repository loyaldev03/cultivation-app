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
      batches.each do |b|
        Time.use_zone(b.facility.timezone) do
          update_status(b)
        end
      end

      active_batches.each do |b|
        Time.use_zone(b.facility.timezone) do
          update_current_growth_stage(b)
          update_plants_current_growth_stage(b)
        end
      end
    end

    private

    def batches
      @batches ||= Cultivation::Batch.
        includes(:facility).
        where(status: Constants::BATCH_STATUS_SCHEDULED)
    end

    def active_batches
      @active_batches ||= Cultivation::Batch.
        includes(:facility).
        where(status: Constants::BATCH_STATUS_ACTIVE)
    end

    def update_status(batch)
      # Activate batch by changing it's status to active
      if current_time >= batch.start_date
        batch.update(status: Constants::BATCH_STATUS_ACTIVE)
      end
    end

    def update_current_growth_stage(batch)
      schedules = Cultivation::QueryBatchPhases.call(batch).grouping_schedules
      if schedules.present?
        # Extrach all phases, make sure this is in the correct order
        phases = schedules.pluck(:phase)
        # Find next phase that starts after current_time
        next_phase = schedules.detect { |p| p.start_date >= current_time }
        if next_phase.present?
          next_index = phases.index(next_phase.phase)
          curr_phase = next_index.positive? ? phases[next_index - 1] : next_phase.phase
          # curr_index = phases.index(curr_phase)
          # Check order to see if we need to advance batch growth stage
          # if next_index && curr_index < next_index
          batch.update(current_growth_stage: curr_phase)
          # end
        else
          curr_schedule ||= schedules.detect { |p| current_time <= p.end_date }
          if curr_schedule.present?
            # curr_index = phases.index(curr_schedule.phase)
            # batch_index = phases.index(batch.current_growth_stage)
            # if curr_index && curr_index > batch_index
            batch.update(current_growth_stage: curr_schedule.phase)
            # end
          end
        end
      end
    end

    def update_plants_current_growth_stage(batch)
      MovePlantsToNextPhaseJob.perform_later(batch.id.to_s)
    end
  end
end

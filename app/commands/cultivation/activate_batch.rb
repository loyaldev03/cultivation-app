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
      @company_info = CompanyInfo.last
    end

    def call
      batches.each do |b|
        Time.use_zone(b.facility.timezone) do
          update_status(b)
        end
      end

      active_batches.each do |batch|
        Time.use_zone(batch.facility.timezone) do
          update_current_growth_stage(batch)
          update_plants_current_growth_stage(batch)
          metrc_daily_trigger(batch)
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
      last_group = batch.tasks.
        where(indelible: Constants::INDELIBLE_GROUP).last
      if !last_group
        return
      end

      if current_time >= last_group.end_date
        # Mark batch as completed
        batch.update(status: Constants::BATCH_STATUS_COMPLETED)
      elsif current_time >= batch.start_date
        # Activate batch by changing it's status to active
        batch.update(status: Constants::BATCH_STATUS_ACTIVE)
        # Schedule job to update plant batches to Metrc
        if @company_info.enable_metrc_integration && @company_info.metrc_ready
          MetrcUpdatePlantBatches.perform_async(batch.id.to_s)
        end
      else
        # Revert back to schedule state
        batch.update(status: Constants::BATCH_STATUS_SCHEDULED)
      end
    end

    def update_current_growth_stage(batch)
      query_cmd = Cultivation::QueryBatchPhases.call(batch)
      grouping_tasks = query_cmd.grouping_tasks
      if grouping_tasks.present?
        # Extrach all phases, make sure this is in the correct order
        # e.g. [
        #   clone,  start: 01/1/2019, end: 10/1/2019
        #   veg1,   start: 10/1/2019, end: 20/1/2019
        #   veg2,   start: 20/1/2019, end: 30/1/2019
        #   flower, start: 30/1/2019, end: 10/2/2019
        # ]
        # Current phase => schedule that start on/after current_time)
        # e.g. current_time is 10/1/2019, phase should be veg1
        # Reverse order of schedules to detect using start_date
        # e.g. [
        #   flower, start: 30/1/2019, end: 10/2/2019
        #   veg2,   start: 20/1/2019, end: 30/1/2019
        #   veg1,   start: 10/1/2019, end: 20/1/2019
        #   clone,  start: 01/1/2019, end: 10/1/2019
        # ]
        curr_phase = grouping_tasks.
          reverse.
          detect { |p| current_time >= p.start_date }
        if curr_phase.present?
          batch.update(
            current_growth_stage: curr_phase.phase,
            current_stage_location: get_phase_location(batch, curr_phase.phase),
            current_stage_start_date: curr_phase.start_date,
            estimated_hours: calculate_estimated_hours(grouping_tasks),
            estimated_labor_cost: calculate_estimated_labor_cost(grouping_tasks),
            estimated_material_cost: calculate_estimated_material_cost(grouping_tasks),
          )
        end
      end
    end

    def metrc_daily_trigger(batch)
      # Generate PlantBatch if necessary
      GenerateBatchLots.perform_async(batch.id.to_s)
    end

    def calculate_estimated_hours(tasks)
      tasks.reduce(0) do |sum, t|
        sum + t.estimated_hours
      end
    end

    def calculate_estimated_labor_cost(tasks)
      tasks.reduce(0) do |sum, t|
        sum + t.estimated_labor_cost
      end
    end

    def calculate_estimated_material_cost(tasks)
      tasks.reduce(0) do |sum, t|
        sum + t.estimated_material_cost
      end
    end

    def get_phase_location(batch, phase)
      cmd = Cultivation::QueryBatchStageLocation.call(batch, phase)
      if cmd.success?
        cmd.result || '--'
      else
        Rollbar.log('error', cmd.errors)
        cmd.errors[:error][0]
      end
    end

    def update_plants_current_growth_stage(batch)
      MovePlantsToNextPhaseJob.perform_later(batch.id.to_s)
    end
  end
end

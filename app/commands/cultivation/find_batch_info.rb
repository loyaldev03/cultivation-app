module Cultivation
  class FindBatchInfo
    prepend SimpleCommand

    attr_reader :args

    def initialize(id)
      @id = id
    end

    def call
      query_record
    end

    private

    def query_record
      @batch = Cultivation::Batch.includes(:facility_strain).find(@id)
      batch_tasks = Cultivation::QueryTasks.call(@batch).result

      children_tasks = batch_tasks.select { |x| !x.have_children?(batch_tasks) }

      # TODO: Should be rewritten to just read from batch.
      total_estimated_hour = children_tasks.sum { |a| a.estimated_hours }
      total_estimated_cost = children_tasks.sum { |a| a.estimated_cost }

      @batch_attributes = {
        id: @batch.id.to_s,
        batch_no: @batch.batch_no,
        name: @batch.name,
        quantity: @batch.quantity,
        facility_id: @batch.facility_id.to_s,
        facility_strain_id: @batch.facility_strain.id.to_s,
        strain: @batch.facility_strain.strain_name,
        batch_source: @batch.batch_source,
        grow_method: @batch.grow_method,
        start_date: @batch.start_date,
        estimated_harvest_date: @batch.estimated_harvest_date,
        current_growth_stage: @batch.current_growth_stage,
        nutrient_profile: @batch.nutrient_profile,
        total_estimated_hour: total_estimated_hour,
        total_estimated_cost: total_estimated_cost,
        materials: @batch.material_summary,
        cultivation_phases: @batch&.facility.growth_stages,
        actual_cost: @batch.actual_cost,
        actual_hours: @batch.actual_hours,
        status: @batch.status,
      }

      if @batch.nil?
        errors.add :not_found, 'Record Not Found'
        nil
      else
        @batch_attributes
      end
    end
  end
end

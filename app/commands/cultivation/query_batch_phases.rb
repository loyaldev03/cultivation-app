module Cultivation
  class QueryBatchPhases
    prepend SimpleCommand

    def initialize(batch, phases = [])
      @batch = batch
      @phases = phases || []
    end

    def call
      if @batch.present? && @batch.tasks.present?
        tasks = @batch.tasks.where(is_phase: true)
        tasks = tasks.where(:phase.in => @phases) unless @phases.empty?
        tasks = tasks.order_by(start_date: :asc)

        phases = tasks.map do |task|
          start_date = task.start_date.beginning_of_day
          end_date = (task.end_date - 1.days).end_of_day
          OpenStruct.new(
            id: task.id,
            name: task.name,
            phase: task.phase,
            start_date: start_date,
            end_date: end_date,
            duration: task.duration,
          )
        end
        phases
      else
        errors.add(:not_found, 'Incomplete Batch Record')
        []
      end
    end
  end
end

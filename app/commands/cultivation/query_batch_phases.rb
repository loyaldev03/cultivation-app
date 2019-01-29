module Cultivation
  class QueryBatchPhases
    prepend SimpleCommand

    def initialize(batch, phases = [])
      @batch = batch
      @phases = phases || []
    end

    def call
      if @batch.present? && @batch.tasks.present?
        tasks = @batch.tasks.where(indelible: "staying")
        tasks = tasks.where(:phase.in => @phases) unless @phases.empty?
        tasks = tasks.order_by(position: :asc)
        phases = tasks.map do |task|
          OpenStruct.new(
            id: task.id,
            name: task.name,
            phase: task.phase,
            start_date: task.start_date,
            end_date: task.end_date,
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

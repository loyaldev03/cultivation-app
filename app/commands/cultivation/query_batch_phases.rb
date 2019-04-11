module Cultivation
  PhaseInfo = Struct.new(:id,
                         :name,
                         :phase,
                         :start_date,
                         :end_date,
                         :duration)

  class QueryBatchPhases
    prepend SimpleCommand

    def initialize(batch, phases = [])
      @batch = batch
      @phases = phases || []
    end

    def call
      if @batch.present? && @batch.tasks.present?
        tasks = @batch.tasks.where(indelible: 'staying')
        tasks = tasks.where(:phase.in => @phases) unless @phases.empty?
        tasks = tasks.order_by(position: :asc)
        phases = tasks.map do |task|
          PhaseInfo.new(
            task.id,
            task.name,
            task.phase,
            task.start_date,
            task.end_date,
            task.duration,
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

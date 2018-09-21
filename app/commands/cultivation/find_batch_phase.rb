module Cultivation
  class FindBatchPhase
    prepend SimpleCommand

    def initialize(batch, phase)
      @batch = batch
      @phase = phase
    end

    def call
      if @batch.present? && @batch.tasks.present? && @phase.present?
        phase_task = @batch.tasks
          .where({is_phase: true, phase: @phase})
          .order_by(start_date: :asc)
          .first
        if phase_task.present?
          start_date = phase_task.start_date.beginning_of_day
          end_date = (phase_task.end_date - 1.days).end_of_day
          return OpenStruct.new({
                   id: phase_task.id,
                   name: phase_task.name,
                   start_date: start_date,
                   duration: phase_task.duration,
                   end_date: end_date,
                 })
        else
          errors.add(:not_found, 'Record Not Found')
        end
      else
        errors.add(:not_found, 'Incomplete Batch Record')
      end
      nil
    end
  end
end

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
          .where({isPhase: true, phase: @phase})
          .order_by(start_date: :asc)
          .first
        if phase_task.present?
          return phase_task
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

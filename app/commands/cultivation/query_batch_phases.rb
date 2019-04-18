module Cultivation
  PhaseInfo = Struct.new(:id,
                         :name,
                         :phase,
                         :start_date,
                         :end_date,
                         :duration)

  class QueryBatchPhases
    prepend SimpleCommand

    attr_reader :staying_schedules, :cleaning_schedules

    def initialize(batch, phases = [])
      @batch = batch
      @phases = phases || []
    end

    def call
      if @batch.present? && @batch.tasks.present?
        tasks = @batch.tasks.where(
          :indelible.in => [
            Constants::INDELIBLE_STAYING,
            Constants::INDELIBLE_CLEANING,
          ],
        )
        tasks = tasks.where(:phase.in => @phases) unless @phases.blank?
        tasks = tasks.order_by(position: :asc).to_a
        staying_tasks = tasks.select { |t| t.indelible == Constants::INDELIBLE_STAYING }
        cleaning_tasks = tasks.select { |t| t.indelible == Constants::INDELIBLE_CLEANING }
        @cleaning_schedules = cleaning_tasks.map do |task|
          PhaseInfo.new(task.id, task.name, task.phase, task.start_date, task.end_date, task.duration)
        end
        @staying_schedules = staying_tasks.map do |task|
          PhaseInfo.new(task.id, task.name, task.phase, task.start_date, task.end_date, task.duration)
        end
      else
        errors.add(:not_found, 'Incomplete Batch Record')
        []
      end
    end
  end
end

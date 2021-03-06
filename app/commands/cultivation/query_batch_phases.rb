module Cultivation
  class QueryBatchPhases
    prepend SimpleCommand

    PhaseInfo = Struct.new(:id,
                           :name,
                           :phase,
                           :start_date,
                           :end_date,
                           :duration)

    attr_reader :staying_schedules,
      :cleaning_schedules,
      :booking_schedules,
      :grouping_schedules,
      :grouping_tasks,
      :growing_schedules

    def initialize(batch, phases = [])
      @batch = batch
      @phases = phases || []
      @booking_schedules = []
    end

    def call
      if @batch.present? && @batch.tasks.present?
        tasks = @batch.tasks.where(
          :indelible.in => [
            Constants::INDELIBLE_GROUP,
            Constants::INDELIBLE_STAYING,
            Constants::INDELIBLE_CLEANING,
          ],
        )
        tasks = tasks.where(:phase.in => @phases) unless @phases.blank?
        tasks = tasks.order_by(position: :asc).to_a
        staying_tasks = tasks.select { |t| t.indelible == Constants::INDELIBLE_STAYING }
        cleaning_tasks = tasks.select { |t| t.indelible == Constants::INDELIBLE_CLEANING }
        @grouping_tasks = tasks.select { |t| t.indelible == Constants::INDELIBLE_GROUP }
        @growing_schedules = tasks.select do |t|
          t.indelible == Constants::INDELIBLE_GROUP &&
            Constants::REQUIRED_BOOKING_PHASES.include?(t.phase)
        end
        @grouping_schedules = grouping_tasks.map do |t|
          PhaseInfo.new(t.id, t.name, t.phase, t.start_date, t.end_date, t.duration)
        end
        @cleaning_schedules = cleaning_tasks.map do |t|
          PhaseInfo.new(t.id, t.name, t.phase, t.start_date, t.end_date, t.duration)
        end
        @staying_schedules = staying_tasks.map do |t|
          PhaseInfo.new(t.id, t.name, t.phase, t.start_date, t.end_date, t.duration)
        end
        @booking_schedules = staying_tasks.map do |t|
          ctask = cleaning_tasks.detect { |c| c.phase == t.phase }
          if ctask.nil?
            end_date = t.end_date
            duration = t.duration
          else
            end_date = ctask.end_date
            duration = t.duration + ctask.duration
          end
          PhaseInfo.new(t.id, t.name, t.phase, t.start_date, end_date, duration)
        end
        @booking_schedules
      else
        errors.add(:not_found, 'Incomplete Batch Record')
        []
      end
    end
  end
end

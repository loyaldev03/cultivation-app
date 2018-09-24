module Cultivation
  class CreateTask
    prepend SimpleCommand

    attr_reader :args

    def initialize(args)
      @args = args
    end

    def call
      save_record(@args)
    end

    private

    def save_record(args)
      Rails.logger.debug "Arguments Sent ====> #{args.inspect}"
      task_related = Cultivation::Task.find(args[:task_related_id])
      batch = task_related.batch
      Rails.logger.debug "Task Related => #{task_related.inspect}"
      task = batch.tasks.create(args.except(:task_related_id, :position))
      Rails.logger.debug "Task => #{task.inspect}"
      Rails.logger.debug "Before move Tasks ===> #{task_related.batch.tasks.pluck(:position)}"

      if args[:position] == 'top'
        position = (task_related.position == 0 ? 0 : (task_related.position - 1))
        Rails.logger.debug "Move to Position => #{position}"
        task.move_to! task_related.position
      else
        position = (task_related.position + 1)
        Rails.logger.debug "Move to Position => #{position}"
        task.move_to! position
      end
      Rails.logger.debug "Tasks ===> #{task_related.batch.tasks.pluck(:position)}"
      task
    end
  end
end

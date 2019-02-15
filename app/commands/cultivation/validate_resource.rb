module Cultivation
  class ValidateResource
    prepend SimpleCommand

    attr_reader :args

    def initialize(args = {})
      @args = args
      @resource_errors = 0
      @over_hours = 0
    end

    def call
      save_record
    end

    private

    def save_record
      batch = Cultivation::Batch.find(args[:batch_id])
      tasks = Cultivation::QueryTasks.call(batch).result
      tasks.each do |task|
        check_task_assigned(batch, task)
        check_over_hours(batch, task)
      end
      errors.add('resource', 'Some of the task have no resource') if @resource_errors > 0 # if estimated hours is set but no user assign
      errors.add('resource', 'Resource overallocation') if @over_hours > 0 # if overhours
    rescue
      Rails.logger.debug "#{$!.message}"
      errors.add(:error, $!.message)
    end

    def check_task_assigned(batch, task)
      if task.estimated_hours > 0.0 && task.user_ids.count == 0
        @resource_errors += 1
        issue = Issues::Issue.find_or_initialize_by(
          task_id: task.id,
          cultivation_batch_id: batch.id.to_s,
          title: "Task #{task.name} have no resource allocate",
        )

        issue.issue_no = Issues::Issue.count + 1
        issue.title = "Task #{task.name} have no resource allocate"
        issue.description = "Task #{task.name} have no resource allocate"
        issue.severity = 'severe'
        issue.issue_type = 'task_from_batch'
        issue.status = 'open'
        issue.task_id = task.id
        issue.cultivation_batch_id = batch.id.to_s
        issue.reported_by = args[:current_user].id
        issue.save
      end
    end

    def check_over_hours(batch, task)
      if task.user_ids.count > 0
        hours_per_person = task.estimated_hours / task.user_ids.count
        if hours_per_person > 8
          @over_hours += 1
          issue = Issues::Issue.find_or_initialize_by(
            task_id: task.id,
            cultivation_batch_id: batch.id.to_s,
            title: "Resource over-allocation for Task #{task.name}",
          )
          issue.issue_no = Issues::Issue.count + 1
          issue.title = "Resource over-allocation for Task #{task.name} "
          issue.description = "Resource over-allocation for Task #{task.name} "
          issue.severity = 'severe'
          issue.issue_type = 'task_from_batch'
          issue.status = 'open'
          issue.task_id = task.id
          issue.cultivation_batch_id = batch.id.to_s
          issue.reported_by = args[:current_user].id
          issue.save
        end
      end
    end
  end
end

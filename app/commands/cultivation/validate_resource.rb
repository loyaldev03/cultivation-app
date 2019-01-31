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

      tasks = batch.tasks
      wbs_list = WbsTree.generate(tasks)
      tasks.each_with_index do |t, i|
        t.wbs = wbs_list[i][:wbs]
      end
      tasks.each do |task|
        check_task_assigned(batch, task)
        check_over_hours(batch, task)
      end
      errors.add('resource', 'Some of the task is not assign') if @resource_errors > 0 # if estimated hours is set but no user assign
      errors.add('resource', 'Over Hours is assign to staff') if @over_hours > 0 # if overhours
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
          title: 'No User Assigned to this task',
        )

        issue.issue_no = Issues::Issue.count + 1
        issue.title = 'No User Assigned to this task'
        issue.description = 'No User Assigned to this task'
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
            title: "Over Hours is assigned for Task #{task.wbs}",
          )
          issue.issue_no = Issues::Issue.count + 1
          issue.title = "Over Hours is assigned for Task #{task.wbs}"
          issue.description = "Over Hours is assigned for Task #{task.wbs}"
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

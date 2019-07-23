module Charts
  class QueryTaskDashboard
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def find_batches(statuses)
      Cultivation::Batch.where(facility_id: @args[:facility_id]).in(
        status: statuses,
      )
    end

    def call
      unassigned_tasks_count = 0
      tasks_with_issues_count = 0
      delayed_tasks_count = 0
      unscheduled_tasks_count = 0

      statuses = [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE, Constants::BATCH_STATUS_COMPLETED]
      delayed_batch_status = [Constants::BATCH_STATUS_ACTIVE, Constants::BATCH_STATUS_COMPLETED]

      batches = find_batches(statuses).includes(:tasks)

      batches.map do |b|
        unassigned_tasks_count += b.tasks.where(users: nil).count
        b.tasks.includes(:issues).map { |task| tasks_with_issues_count += 1 if task.issues.present? }
      end

      find_batches([Constants::BATCH_STATUS_DRAFT]).includes(:tasks).map do |b|
        unscheduled_tasks_count += b.tasks.count
      end

      find_batches(delayed_batch_status).map do |b|
        b.tasks.map { |task| delayed_tasks_count += 1 if task.end_date.to_date < Time.current.to_date }
      end

      {
        unassigned_tasks_count: unassigned_tasks_count,
        tasks_with_issues_count: tasks_with_issues_count,
        unscheduled_tasks_count: unscheduled_tasks_count,
        delayed_tasks_count: delayed_tasks_count,
      }
    end
  end
end

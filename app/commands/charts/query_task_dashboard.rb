module Charts
  class QueryTaskDashboard
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      {
        unassigned_tasks_count: Charts::QueryUnassignedTasksCount.call.result,
        tasks_with_issues_count: Charts::QueryTasksWithIssuesCount.call.result,
        unscheduled_tasks_count: Charts::QueryUnscheduledTasksCount.call.result,
        delayed_tasks_count: Charts::QueryDelayedTasksCount.call.result,
      }
    end
  end
end

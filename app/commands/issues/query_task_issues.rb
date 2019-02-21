module Issues
  class QueryTaskIssues
    prepend SimpleCommand

    attr_reader :task_id, :filter_status

    def initialize(task_id, filter_status = %w(open resolved))
      @task_id = task_id
      @filter_status = filter_status
    end

    def call
      Issues::Issue.where(task_id: task_id, is_archived: false).
        in(status: filter_status).
        order(created_at: :desc)
    end
  end
end

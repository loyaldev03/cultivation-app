module Issues
  class QueryBatchIssues
    prepend SimpleCommand

    attr_reader :batch_id, :filter_status

    def initialize(batch_id, filter_status = %w(open resolved))
      @batch_id = batch_id
      @filter_status = filter_status
    end

    def call
      Issues::Issue.where(cultivation_batch_id: batch_id, is_archived: false).
        in(status: filter_status).
        order(created_at: :desc)
    end
  end
end

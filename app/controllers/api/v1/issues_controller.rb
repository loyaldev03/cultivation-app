class Api::V1::IssuesController < Api::V1::BaseApiController
  def by_batch
    issues = Issues::QueryBatchIssues.call(params[:batch_id]).result
    Rails.logger.debug "\t\t\t>>> issues: #{issues.inspect}"
    render json: Issues::IssueSerializer.new(issues).serialized_json
  end
end

class Api::V1::IssuesController < Api::V1::BaseApiController
  def batch_issues
    issues = Issues::QueryIssues.call(params[:batch_id])
    render json: Issues::IssueSerializer.new(issues).serialized_json
  end
end

class Api::V1::IssuesController < Api::V1::BaseApiController
  def show
    issue = Issues::Issue.find(params[:id])
    render json: Issues::IssueSerializer.new(issue).serialized_json
  end

  def by_batch
    issues = Issues::QueryBatchIssues.call(params[:batch_id]).result
    render json: Issues::IssueSerializer.new(issues).serialized_json
  end

  def create
    command = Issues::SaveIssue.call(current_user, params.to_unsafe_h)
    if command.success?
      render json: Issues::IssueSerializer.new(command.result).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end
end

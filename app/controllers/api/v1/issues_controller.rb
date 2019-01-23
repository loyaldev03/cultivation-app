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

  def add_comment
    Rails.logger.debug "\t\t\t>>>>>> current_user: #{current_user.inspect}"
    command = Issues::AddComment.call(current_user, params.to_unsafe_h)

    if command.success?
      render json: Issues::IssueCommentSerializer.new(command.result).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def comments
    issue = Issues::Issue.find(params[:id])
    comments = issue ? Issues::Issue.find(params[:id]).comments : []
    render json: Issues::IssueCommentSerializer.new(comments).serialized_json
  end
end

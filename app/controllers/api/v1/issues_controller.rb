class Api::V1::IssuesController < Api::V1::BaseApiController
  def unresolved_count
    count = Issues::Issue.where(
      status: {:$ne => 'resolved'},
      is_archived: false,
      cultivation_batch: params[:batch_id],
    ).count
    render json: {count: count}, status: 200
  end

  def show
    issue = Issues::Issue.find(params[:id])
    options = {params: {current_user_id: current_user.id.to_s}}
    render json: Issues::IssueSerializer.new(issue, options).serialized_json
  end

  def by_batch
    issues = Issues::QueryBatchIssues.call(params[:batch_id]).result
    render json: Issues::IssueSerializer.new(issues).serialized_json
  end

  def by_task
    issues = Issues::QueryTaskIssues.call(params[:task_id]).result
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
    command = Issues::AddComment.call(current_user, params.to_unsafe_h)
    if command.success?
      options = {params: {current_user_id: current_user.id.to_s}}
      render json: Issues::IssueCommentSerializer.new(command.result, options).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def comments
    options = {params: {current_user_id: current_user.id.to_s}}
    issue = Issues::Issue.find(params[:id])
    comments = issue ? Issues::Issue.find(params[:id]).comments : []
    render json: Issues::IssueCommentSerializer.new(comments, options).serialized_json
  end

  def archive
    command = Issues::ArchiveIssue.call(params.to_unsafe_h)
    if command.success?
      render json: Issues::IssueSerializer.new(command.result).serialized_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end

  def attachment
    # TODO: return both cache/ url and store/ url
    # Example of calling that works...
    # let resp = await fetch(`/api/v1/issues/1/attachment?key=d5346233691cc77372ed3c3268c98755.png`, httpGetOptions).then(x => x.text())
    link = Shrine.storages[:cache].url(params[:key])
    render plain: link
  end

  def resolve
    command = Issues::ResolveIssue.call(current_user, params.to_unsafe_h)
    if command.success?
      render json: {id: params[:id]}, status: 200
    else
      render json: {id: params[:id]}, status: 500
    end
  end

  def assign_to
    command = Issues::AssignIssueTo.call(current_user, params.to_unsafe_h)
    if command.success?
      render json: {id: params[:id]}, status: 200
    else
      render json: {id: params[:id]}, status: 500
    end
  end

  def followers
    command = Issues::AssignIssueFollowers.call(current_user, params.to_unsafe_h)
    if command.success?
      render json: {id: params[:id]}, status: 200
    else
      render json: {id: params[:id]}, status: 500
    end
  end

  def update_comment
    command = Issues::UpdateComment.call(current_user, params.to_unsafe_h)
    if command.success?
      render json: {id: params[:id]}, status: 200
    else
      render json: {id: params[:id]}, status: 500
    end
  end

  def delete_comment
    command = Issues::DeleteComment.call(current_user, params.to_unsafe_h)
    if command.success?
      render json: {id: params[:id]}, status: 200
    else
      render json: {id: params[:id]}, status: 500
    end
  end
end

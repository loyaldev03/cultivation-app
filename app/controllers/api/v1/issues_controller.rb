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
    Rails.logger.debug "\t\t\t>>> params: #{params.inspect}"

    p = params.to_unsafe_h
    issue = Issues::Issue.find(p[:id])
    issue.status = 'resolved'
    issue.resolution_notes = p[:notes]
    issue.reason = p[:reason]
    issue.resolved_at = Time.now
    issue.resolved_by = current_user
    issue.save!

    render json: Issues::IssueSerializer.new(issue).serialized_json
  end
end

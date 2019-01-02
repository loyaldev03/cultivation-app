class Api::V1::IssuesController < Api::V1::BaseApiController
  def by_batch
    issues = Issues::QueryBatchIssues.call(params[:batch_id]).result
    Rails.logger.debug "\t\t\t>>> issues: #{issues.inspect}"
    render json: Issues::IssueSerializer.new(issues).serialized_json
  end

  def create
    cultivation_batch = Cultivation::Batch.find(params[:batch_id])
    issue_params = params.to_unsafe_h.merge(cultivation_batch: cultivation_batch)

    command = Issues::CreateIssue.call(current_user, issue_params)
    if command.success?
      render json: {status: 200}.to_json
    else
      render json: request_with_errors(command.errors), status: 422
    end
  end
end

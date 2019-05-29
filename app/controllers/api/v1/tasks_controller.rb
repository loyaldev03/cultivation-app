class Api::V1::TasksController < Api::V1::BaseApiController
  before_action :set_batch, except: [:update_position]

  def index
    facility_id = params[:facility_id]
    tasks = Cultivation::QueryTasks.call(@batch, [:issues], facility_id).result
    render json: TaskSerializer.new(tasks).serialized_json

    # if @batch.present?
    #   facility_id = params[:facility_id]
    #   tasks = Cultivation::QueryTasks.call(@batch, [:issues], facility_id).result
    #   render json: TaskSerializer.new(tasks).serialized_json
    # else
    #   render json: {data: 'Batch Not Found'}, status: 422
    # end
  end

  def active_tasks
    # TODO: Need to be replace with active_tasks_agg
    # Tasks for all active batch
    pagy, tasks = pagy(Cultivation::Task.all)
    render json: {
      data: TaskSerializer.new(tasks).serializable_hash[:data],
      pagy: pagy,
    }
  end

  def active_tasks_agg
    query_cmd = Cultivation::QueryTasksAggregate.call(
      current_user,
      facility_id: params[:facility_id],
      page: params[:page],
      limit: params[:limit],
      search: params[:search],
    )
    if query_cmd.success?
      result = query_cmd.result
      render json: {
        data: result.as_json,
        metadata: query_cmd.metadata.as_json,
      }
    else
      render json: {errors: query_cmd.errors}
    end
  end

  def update
    update_cmd = Cultivation::UpdateTask.call(current_user, task_params)
    if update_cmd.success?
      render json: TaskSerializer.new(update_cmd.result).serialized_json
    else
      render json: {errors: update_cmd.errors}
    end
  end

  def update_position
    update_cmd = Cultivation::UpdateTaskPosition.call(
      current_user,
      params[:id],
      params[:target_position_task_id],
    )
    if update_cmd.success?
      render json: {data: {id: update_cmd.result.id.to_s}}
    else
      render json: {errors: update_cmd.errors}
    end
  end

  def update_indent
    indent_cmd = Cultivation::UpdateTaskIndent.call(
      params[:id],            # task.id
      params[:indent_action], # in / out
      current_user,
    )
    if indent_cmd.success?
      render json: {data: {id: indent_cmd.result.id.to_s}}
    else
      render json: {errors: indent_cmd.errors}
    end
  end

  def create
    create_cmd = Cultivation::CreateTask.call(current_user, task_params, current_default_facility.id)
    if create_cmd.success?
      render json: {data: {id: create_cmd.result.id.to_s}}
    else
      render json: {errors: create_cmd.errors}
    end
  end

  def destroy
    delete_cmd = Cultivation::DestroyTask.call(current_user, params[:id])
    if delete_cmd.success?
      render json: {data: delete_cmd.result}
    else
      render json: {error: delete_cmd.errors}
    end
  end

  def delete_relationship
    destination_task = Cultivation::Task.find(params[:destination_id])
    if destination_task.present?
      destination_task.update(depend_on: nil)
      render json: {data: {id: destination_task.id}}
    else
      render json: {errors: 'Task Not Found'}
    end
  end

  def locations
    command = Cultivation::QueryTrayPlanOfTask.call(params[:batch_id], params[:id])
    if command.success?
      render json: command.result
    else
      render json: {error: command.errors}
    end
  end

  # TODO: Not so comfortable this is a direct replacement of items
  # Items that already has usage should not be replaced.
  def update_material_use
    command = Cultivation::SaveMaterialUse.call(current_user,
                                                params[:id],
                                                params[:items],
                                                params[:water_ph])
    if command.success?
      render json: TaskSerializer.new(command.result).serialized_json
    else
      render json: {error: command.errors}
    end
  end

  def append_material_use
    command = Cultivation::AppendMaterialUse.call(current_user,
                                                  params[:id],
                                                  params[:items])
    if command.success?
      render json: TaskSerializer.new(command.result).serialized_json
    else
      render json: {error: command.errors}
    end
  end

  def actual_hours
    tasks = @batch.tasks.includes(:time_logs)
    result = tasks.map { |task| {task_id: task.id.to_s, actual_hours: task.sum_actual_hours} }
    render json: {data: result}
  end

  def load_issues
    tasks = @batch.tasks.includes(:issues)
    result = tasks.map { |task| {task_id: task.id.to_s, issues: task.issues.reject { |a| a.is_archived? }.map { |a| {id: a.id.to_s, title: a.title} }} }
    render json: {data: result}
  end

  private

  def set_batch
    if params[:batch_id] != 'others'
      @batch = Cultivation::Batch.includes(:tasks).find_by(id: params[:batch_id])
    end
  end

  def task_params
    params.require(:task).permit(:phase,
                                 :name,
                                 :duration,
                                 :start_date,
                                 :end_date,
                                 :estimated_hours,
                                 :estimated_cost,
                                 :depend_on,
                                 :position,
                                 :action,
                                 :task_related_id,
                                 :expected_hours_taken,
                                 :time_taken,
                                 :id,
                                 :batch_id,
                                 :location_id,
                                 :location_type,
                                 assigned_employee: [:label, :value], user_ids: [])
  end
end

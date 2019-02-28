class Api::V1::DailyTasksController < Api::V1::BaseApiController
  def tasks
    # TODO: make into command
    @tasks_date = Time.now.beginning_of_day
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector
    @tasks_by_batch = Cultivation::Task.collection.aggregate(
      [
        {"$match": match},
        {"$group": {_id: '$batch_id', tasks: {"$push": '$_id'}}},
      ],
    ).map do |batch_group|
      batch = Cultivation::Batch.find(batch_group['_id'])
      {
        batch: serialized_batch(batch),
        tasks: serialized_tasks(batch, batch_group['tasks']),
      }
    end
    render json: @tasks_by_batch
  end

  def time_log
    case params[:actions]
    when 'start'
      cmd = DailyTask::StartTimeLog.call(current_user.id, params[:task_id])
    when 'stop'
      cmd = DailyTask::StopTimeLog.call(current_user.id, params[:task_id])
    when 'stuck'
      cmd = DailyTask::StuckTask.call(current_user.id, params[:task_id])
    when 'done'
      cmd = DailyTask::DoneTask.call(current_user.id, params[:task_id])
    end
    data = TaskDetailsSerializer.new(cmd.result).serialized_json
    render json: data
  end

  def update_note
    update_cmd = DailyTask::UpdateNote.call(
      current_user,
      params[:id],
      params[:note_id],
      params[:body],
    )
    if update_cmd.success?
      note = {
        id: update_cmd.result.id.to_s,
        task_id: update_cmd.task_id.to_s,
        body: update_cmd.result.body,
        u_at: update_cmd.result.u_at,
        u_by: update_cmd.result[:u_by],
      }
      render json: {data: note.as_json}
    else
      render json: {errors: update_cmd.errors}
    end
  end

  def destroy_note
    del_cmd = DailyTask::DeleteNote.call(
      current_user,
      params[:id],
      params[:note_id],
    )
    if del_cmd.success?
      render json: {data: del_cmd.note_id.to_s}
    else
      render json: {errors: del_cmd.errors}
    end
  end

  def add_notes
    @work_day.notes.create(notes: params[:notes])

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  def save_material_used
    task_id = params[:id]
    date = Time.parse(params[:date]).beginning_of_day
    material_used_id = params['materialUsedId']
    actual = params[:actual]
    waste = params[:waste]

    Rails.logger.debug "\t\t\t\t>>>>> add_material_used id. task id: #{task_id}, date: #{date.inspect}, material_used_id: #{material_used_id}, actual: #{actual}, waste: #{waste}"

    command = DailyTask::SaveMaterialUsed.call(current_user, task_id, date, material_used_id, actual, waste)
    if command.success?
      r = command.result
      render json: command.result, status: 200
    else
      render json: command.errors, status: 422
    end
  end

  # Returns all material used
  def materials_used
    task_ids = params[:task_ids]
    # Cultivation::Task.in(id: task_ids)
    # material_used_ids
    # date = Time.parse(params[:date]).to_date
    # # t = Cultivation::Task.in(id: task_ids).

    # txs = Inventory::ItemTransaction.where(ref_id: { '$in': [material_used_ids] }, ref_type: 'Cultivation::Item', event_date: date)
  end

  private

  def serialized_batch(id)
    batch = Cultivation::Batch.find(id)
    BatchSerializer.new(batch, params: {exclude_tasks: true}).
      serializable_hash[:data].
      merge(rooms: batch_room_names(batch))
  end

  def serialized_tasks(batch, task_ids)
    tasks = Cultivation::QueryTasks.call(batch, [:issues]).result
    active_tasks = tasks.select { |t| task_ids.include?(t.id) }
    active_user_ids = active_tasks.map { |t| t.notes.pluck(:modifier_id) }.flatten.compact
    # Map user's display name to api response
    note_users = User.where(:_id.in => active_user_ids).to_a
    active_tasks.each do |t|
      t.notes.each do |n|
        user = note_users.detect { |u| u.id == n.modifier_id }
        if user
          n[:u_by] = user.display_name
        end
      end
    end
    TaskDetailsSerializer.new(active_tasks).serializable_hash[:data]
  end

  def batch_room_names(batch)
    plans = batch.tray_plans.where(phase: batch.current_growth_stage).to_a
    plans.map do |tray_plan|
      facility = Facility.where('rooms._id': BSON::ObjectId(tray_plan.room_id)).first
      facility.rooms.find(tray_plan.room_id).name
    end
  end
end

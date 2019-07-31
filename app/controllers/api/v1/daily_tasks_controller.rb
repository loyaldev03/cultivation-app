class Api::V1::DailyTasksController < Api::V1::BaseApiController
  def tasks
    # TODO: make into command
    @tasks_date = Time.current.beginning_of_day
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector
    @tasks_by_batch = Cultivation::Task.collection.aggregate(
      [
        {"$match": match},
        {"$group": {_id: '$batch_id', tasks: {"$push": '$_id'}}},
      ],
    ).map do |batch_group|
      batch = Cultivation::Batch.find(batch_group['_id'])
      all_tasks = Cultivation::QueryTasks.call(batch, [:issues]).result
      current_user_tasks = batch_group['tasks']

      {
        batch: serialized_batch(batch),
        tasks: serialized_tasks(all_tasks, current_user_tasks, batch.facility_id),
      }
    end

    render json: @tasks_by_batch
  end

  def other_tasks
    @tasks_date = Time.current.beginning_of_day
    tasks = get_other_tasks(current_user.id, @tasks_date)

    if tasks.any?
      # tasks_hash = TaskDetailsSerializer.new(tasks).serializable_hash[:data]
      result = {
        batch: {type: 'others', name: 'Others'},
        tasks: serialized_tasks(tasks),
      }
    end

    render json: result
  end

  def tasks_by_date
    tasks = current_user.cultivation_tasks.expected_on(params[:date])
    batches = Cultivation::Batch.in(id: tasks.map(&:batch_id).uniq)
    locations = batches.map do |a|
      {batch_id: a.id.to_s, query: QueryLocations.call(a.facility_id)}
    end
    json_serializer = TaskCalendarSerializer.new(
      tasks,
      params: {query: locations},
    ).serializable_hash[:data]

    render json: json_serializer
  end

  def work_schedules
    result = DailyTask::QueryUserWorkSchedules.call(params[:start_date],
                                                    params[:end_date],
                                                    current_user).result
    render json: result
  end

  def tasks_by_date_range
    result = DailyTask::QueryTaskByDateRange.call(params[:start_date],
                                                  params[:end_date],
                                                  current_user).result
    render json: result
  end

  def time_log
    case params[:actions]
    when Constants::WORK_STATUS_STARTED
      cmd = DailyTask::StartTimeLog.call(current_user.id, params[:task_id])
    when Constants::WORK_STATUS_STOPPED
      cmd = DailyTask::StopTimeLog.call(current_user.id, params[:task_id])
    when Constants::WORK_STATUS_STUCK
      cmd = DailyTask::StuckTask.call(current_user.id, params[:task_id])
    when Constants::WORK_STATUS_DONE
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

  def update_nutrients
    update_cmd = DailyTask::UpdateNutrients.call(
      current_user,
      params[:id], # task_id
      params[:nutrients],
    )
    if update_cmd.success?
      render json: {data: update_cmd.result.id.to_s}
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

  def save_material_used
    task_id = params[:id]
    date = Time.parse(params[:date]).beginning_of_day
    material_used_id = params['materialUsedId']
    actual = params[:actual]
    waste = params[:waste]

    # Rails.logger.debug "\t\t\t\t>>>>> add_material_used id. task id: #{task_id}, date: #{date.inspect}, material_used_id: #{material_used_id}, actual: #{actual}, waste: #{waste}"

    command = DailyTask::SaveMaterialUsage.call(current_user, task_id, date, material_used_id, actual, waste)
    if command.success?
      data = command.result.map do |tx|
        {
          key: "#{tx.ref_id.to_s}.#{tx.event_type}",
          material_use_id: tx.ref_id.to_s,
          type: tx.event_type,
          quantity: -tx.quantity,
          date: tx.event_date.iso8601,
        }
      end

      render json: data, status: 200
    else
      render json: command.errors, status: 422
    end
  end

  # Returns all material used
  def materials_used
    task_ids = params[:task_ids]
    date = Time.parse(params[:date]).beginning_of_day
    material_used_ids = []

    Cultivation::Task.in(id: task_ids).each do |t|
      material_used_ids.concat(t.material_use.map { |mu| mu.id.to_s })
    end

    # txs = Inventory::ItemTransaction.where(ref_id: { '$in': [material_used_ids] }, ref_type: 'Cultivation::Item', event_date: date)
    data = Inventory::ItemTransaction.in(ref_id: material_used_ids).where(event_date: date).map do |tx|
      {
        key: "#{tx.ref_id.to_s}.#{tx.event_type}",
        material_use_id: tx.ref_id.to_s,
        type: tx.event_type,
        quantity: -tx.quantity,
        date: tx.event_date.iso8601,
      }
    end

    render json: data, status: 200
  end

  def harvest_batch_status
    batch = Cultivation::Batch.find(params[:batch_id])
    harvest_batch = Inventory::HarvestBatch.find_by(cultivation_batch_id: params[:batch_id])

    if harvest_batch
      data = {
        total_plants: batch.plants.where(destroyed_date: nil).count,
        total_weighted: harvest_batch.plants.count,
        uom: harvest_batch.uom,
        harvest_batch_name: harvest_batch.harvest_name,
        total_wet_waste_weight: harvest_batch.total_wet_waste_weight,
        total_dry_weight: harvest_batch.total_dry_weight,
        total_trim_weight: harvest_batch.total_trim_weight,
        total_trim_waste_weight: harvest_batch.total_trim_waste_weight,
        total_cure_weight: harvest_batch.total_cure_weight,
      }
      render json: data, status: 200
    else
      render json: {errors: {harvest_bath: ['Harvest batch is not setup.']}}, status: 422
    end
  end

  def save_harvest_batch_weight
    command = DailyTask::SavePlantHarvestWeight.call(
      current_user,
      params[:batch_id],
      params[:plant_id],
      params[:weight],
      params[:override]
    )

    if command.success?
      render json: command.result, status: 200
    else
      render json: {errors: command.errors}, status: 422
    end
  end

  def save_weight
    batch = Cultivation::Batch.find(params[:batch_id])
    harvest_batch = Inventory::HarvestBatch.find_by(cultivation_batch_id: params[:batch_id])

    if harvest_batch.nil?
      render json: {errors: {harvest_bath: ['Harvest batch is not setup.']}}, status: 422 and return
    end

    if params[:indelible] == 'measure_waste_weight' #match attribute with indelible
      args = {total_wet_waste_weight: params[:weight]}
    elsif params[:indelible] == 'measure_dry_weight'
      args = {total_dry_weight: params[:weight]}
    elsif params[:indelible] == 'measure_trim_weight'
      args = {total_trim_weight: params[:weight]}
    elsif params[:indelible] == 'measure_trim_waste'
      args = {total_trim_waste_weight: params[:weight]}
    elsif params[:indelible] == 'measure_cure_weight'
      args = {total_cure_weight: params[:weight]}
    else
      args = {}
    end

    harvest_batch.update(args)

    data = {
      total_plants: batch.plants.where(destroyed_date: nil).count,
      total_weighted: harvest_batch.plants.count,
      uom: harvest_batch.uom,
    }
    render json: data, status: 200
  end

  def save_pto
    command = Common::SaveWorkRequest.call(current_user, 'PTO', params[:start_date], params[:end_date], params[:description])
    if command.success?
      render json: command.result, status: 200
    else
      render json: {error: command.errors}, status: 422
    end
  end

  def save_ot
    command = Common::SaveWorkRequest.call(current_user, 'OT', params[:start_date], params[:end_date], params[:description])
    if command.success?
      render json: command.result, status: 200
    else
      render json: {error: command.errors}, status: 422
    end
  end

  def schedule_by_date
    date = Time.zone.parse(params[:date], Time.current)
    work_schedule = current_user.work_schedules.find_by(start_date: (date.beginning_of_day..date.end_of_day))
    Rails.logger.debug "Work Schedule ==> #{work_schedule}"
    if work_schedule
      render json: {
        start_date: params[:date],
        start_time: work_schedule.start_time&.strftime('%H:%M'),
        end_time: work_schedule.end_time&.strftime('%H:%M'),
      }
    else
      render json: {
        start_date: params[:date],
        start_time: '',
        end_time: '',
      }
    end
  end

  private

  def serialized_batch(id)
    batch = Cultivation::Batch.find(id)
    BatchSerializer.new(batch, params: {exclude_tasks: true}).
      serializable_hash[:data].
      merge(rooms: batch_room_names(batch))
  end

  def serialized_tasks(tasks, filter_task_ids = nil, facility_id = nil)
    active_tasks = if filter_task_ids.present?
                     tasks.select { |t| filter_task_ids.include?(t.id) }
                   else
                     tasks
                   end

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

    options = {}
    options = {query: QueryLocations.call(facility_id)} if facility_id.present?

    TaskDetailsSerializer.new(
      active_tasks,
      params: options,
    ).serializable_hash[:data]
  end

  def get_other_tasks(user_id, start_date)
    user = User.find(user_id)
    tasks = user.cultivation_tasks.
      expected_on(start_date).
      in(user_ids: user_id).
      where(batch_id: nil)
    tasks
  end

  # def serialized_other_tasks(tasks)
  #   tasks = current_user.cultivation_tasks.
  #     expected_on(date).
  #     in(user_ids: current_user.id).
  #     where(batch_id: nil)

  #   Rails.logger.debug "\n\r\t\t\t>>>>>>>>>>>>>>>>>>>>>> other_tasks"
  #   Rails.logger.debug tasks.to_a.inspect
  #   Rails.logger.debug "\t\t\t>>>>>>>>>>>>>>\n\n\r"

  #   TaskDetailsSerializer.new(tasks).serializable_hash[:data]
  # end

  def batch_room_names(batch)
    plans = batch.tray_plans.where(phase: batch.current_growth_stage).to_a
    plans.map do |tray_plan|
      facility = Facility.where('rooms._id': BSON::ObjectId(tray_plan.room_id)).first
      facility&.rooms&.find(tray_plan.room_id)&.name
    end
  end
end

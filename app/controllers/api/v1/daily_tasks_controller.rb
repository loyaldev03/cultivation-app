class Api::V1::DailyTasksController < Api::V1::BaseApiController
  before_action :set_task, except: [:tasks]
  before_action :set_work_day, except: [:tasks]

  def tasks
    #make to command
    @tasks_date = Date.today
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector
    @tasks_by_batch = Cultivation::Task.collection.aggregate(
      [
        {"$match": match},
        {"$group": {_id: '$batch_id', tasks: {"$push": '$_id'}}},
      ],
    ).map do |batch_group|
      {
        batch: serialized_batch(batch_group['_id']),
        tasks: serialized_tasks(batch_group['_id'], batch_group['tasks']),
      }
    end
    render json: @tasks_by_batch
  end

  def time_log
    case params[:action]
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

  def add_notes
    @work_day.notes.create(notes: params[:notes])

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  def update_materials_used
    updated_materials_used = []
    # Rails.logger.debug "\t\t\t\t>>>>> params[:materials]"
    # Rails.logger.debug params[:materials]

    params[:materials].each do |material|
      unless material[:catalogue_id].blank?
        material_used = @work_day.materials_used.find_or_create_by(catalogue_id: material[:catalogue_id])
        material_used.task_item_id = material[:task_item_id]
        material_used.quantity = material[:qty]
        material_used.uom = material[:uom] # TODO: Should be referring to Common::UnitOfMeasure
        material_used.save

        updated_materials_used << material_used.catalogue_id
      end
    end

    @work_day.materials_used.not_in(catalogue_id: updated_materials_used).destroy_all
    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  private

  def set_task
    @task = current_user.cultivation_tasks.find(params[:id])
  end

  def set_work_day
    @work_day = @task.work_days.find_or_create_by!(date: params[:date], user: current_user)
  end

  def serialized_batch(id)
    batch = Cultivation::Batch.find(id)
    BatchSerializer.new(batch, params: {exclude_tasks: true}).
      serializable_hash[:data].
      merge(rooms: batch_room_names(batch))
  end

  def serialized_tasks(batch_id, task_ids)
    all_tasks = Cultivation::Batch.find(batch_id).tasks

    # Create a map where task id is the Key and wbs is the Value.
    wbs_map = WbsTree.generate(all_tasks).inject({}) do |memo, item|
      memo[item[:id]] = item[:wbs]
      memo
    end

    work_days = Cultivation::Task.in(id: task_ids).to_a
    work_days.each do |t|
      t.wbs = wbs_map[t.id.to_s]
    end

    TaskDetailsSerializer.new(work_days).serializable_hash[:data]
  end

  def serialized_catalogue
    catalogues = Inventory::Catalogue.raw_materials.selectable.order(label: :asc)
    Inventory::CatalogueSerializer.new(catalogues).serializable_hash[:data]
  end

  def batch_room_names(batch)
    plans = batch.tray_plans.where(phase: batch.current_growth_stage).to_a
    plans.map do |tray_plan|
      facility = Facility.where('rooms._id': BSON::ObjectId(tray_plan.room_id)).first
      facility.rooms.find(tray_plan.room_id).name
    end
  end
end

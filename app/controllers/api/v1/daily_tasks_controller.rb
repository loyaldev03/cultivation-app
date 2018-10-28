class Api::V1::DailyTasksController < Api::V1::BaseApiController
  before_action :set_task
  before_action :set_work_day

  def start_task
    @work_day.start!

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  def stop_task
    @work_day.stop!

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  def add_notes
    @work_day.notes.create(notes: params[:notes])

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  def update_materials_used
    updated_raw_materials = []
    params[:materials].each do |material|
      material_used = @work_day.materials_used.find_or_create_by(
        raw_material_id: material[:raw_material_id],
      )
      material_used.item_id = material[:item_id]
      material_used.quantity = material[:qty]
      material_used.uom = material[:uom] # TODO: Should be referring to Common::UnitOfMeasure
      material_used.save
      updated_raw_materials << material_used.raw_material_id
    end

    @work_day.materials_used.not_in(raw_material_id: updated_raw_materials).destroy_all

    data = WorkDaySerializer.new(@work_day).serialized_json
    render json: data
  end

  private

  def set_task
    @task = current_user.cultivation_tasks.find(params[:id])
  end

  def set_work_day
    @work_day = @task.work_days.find_or_initialize_by(date: params[:date], user: current_user)
  end
end

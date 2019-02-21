class Api::V1::DailyTasksController < Api::V1::BaseApiController
  before_action :set_task
  before_action :set_work_day

  def start_task
    # @work_day.start!
    cmd = Cultivation::StartTimeLog.call(params[:id])
    data = WorkDaySerializer.new(cmd.result).serialized_json
    render json: data
  end

  def stop_task
    # @work_day.stop!
    cmd = Cultivation::StopTimeLog.call(params[:id])
    data = WorkDaySerializer.new(cmd.result).serialized_json
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
end

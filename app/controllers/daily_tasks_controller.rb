class DailyTasksController < ApplicationController
  def index
    @tasks_date = Date.today
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector
    # debugger
    @tasks_by_batch = Cultivation::Task.collection.aggregate(
      [
        {"$match": match},
        {"$group": {_id: '$batch_id', tasks: {"$push": '$_id'}}},
      ],
    ).map do |batch_group|
      {
        batch: serialized_batch(batch_group['_id']),
        tasks: serialized_tasks(batch_group['tasks']),
      }
    end

    @inventory_catalogue = serialized_catalogue
  end

  private

  def serialized_batch(id)
    batch = Cultivation::Batch.find(id)
    BatchSerializer.new(batch, params: {exclude_tasks: true}).
      serializable_hash[:data].
      merge(rooms: batch_room_names(batch))
  end

  def serialized_tasks(task_ids)
    work_days = task_ids.map do |task_id|
      Cultivation::Task.find(task_id).work_days.find_or_initialize_by(date: @tasks_date, user: current_user)
    end
    # Rails.logger.debug "\t\t\t>>> serialized_tasks > workday.materials_used.count: #{work_days.first.materials_used.count}"
    # Rails.logger.debug "\t\t\t>>> serialized_tasks > workday.materials_wasted.count: #{work_days.first.materials_wasted.count}"
    # Rails.logger.debug "\t\t\t>>> serialized_tasks > workday.time_logs.count: #{work_days.first.time_logs.count}"
    WorkDaySerializer.new(work_days).serializable_hash[:data]
  end

  def serialized_catalogue
    Inventory::CatalogueSerializer.new(Inventory::Catalogue.all).serializable_hash[:data]
  end

  def batch_room_names(batch)
    plans = batch.tray_plans.where(phase: batch.current_growth_stage).to_a
    plans.map do |tray_plan|
      facility = Facility.where('rooms._id': BSON::ObjectId(tray_plan.room_id)).first
      facility.rooms.find(tray_plan.room_id).name
    end
  end
end

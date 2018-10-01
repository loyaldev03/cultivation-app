class DailyTasksController < ApplicationController
  def index
    @tasks_date = Date.today
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector

    @tasks_by_batch = Cultivation::Task.collection.aggregate(
      [
        { "$match": match },
        { "$group": { _id: "$batch_id", tasks: { "$push": "$_id" } } },
      ],
    ).map do |batch_group|
      {
        batch: serialized_batch(batch_group["_id"]),
        tasks: serialized_tasks(batch_group["tasks"]),
      }
    end
  end

  private

  def serialized_batch(id)
    batch = Cultivation::Batch.find(id)
    BatchSerializer.new(batch, params: { exclude_tasks: true }).
      serializable_hash[:data].
      merge(rooms: batch_room_names(batch))
  end

  def serialized_tasks(task_ids)
    WorkDaySerializer.new(task_ids.map do |task_id|
      Cultivation::Task.find(task_id).work_days.find_or_initialize_by(date: @tasks_date, user: current_user)
    end).serializable_hash[:data]
  end

  def batch_room_names(batch)
    batch.tray_plans.map do |tray_plan|
      facility = Facility.where('rooms._id': BSON::ObjectId(tray_plan.room_id)).first
      facility.rooms.find(tray_plan.room_id).name
    end
  end
end

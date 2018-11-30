class WorkDaySerializer
  include FastJsonapi::ObjectSerializer

  attributes :user_id, :date, :is_done, :time_logs, :notes, :materials_wasted, :duration

  attributes :task do |object|
    tasks = object.task.batch.tasks.order_by(position: :asc)
    users = User.active
    TaskSerializer.new(object.task, params: {users: users, tasks: tasks}).serializable_hash[:data]
  end

  attributes :status do |object|
    object.aasm_state
  end

  attributes :materials_used do |object|
    object.materials_used.map do |mu|
      MaterialsUsedSerializer.new(mu).serializable_hash[:data][:attributes]
    end
  end
end

class WorkDaySerializer
  include FastJsonapi::ObjectSerializer

  attributes :user_id, :date, :is_done, :time_logs, :notes, :materials_used, :materials_wasted, :duration

  attributes :task do |object|
    TaskSerializer.new(object.task).serializable_hash[:data]
  end

  attributes :status do |object|
    object.aasm_state
  end
end

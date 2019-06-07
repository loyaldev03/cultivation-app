class NotificationSerializer
  include FastJsonapi::ObjectSerializer

  attributes :read_at

  attribute :id do |object|
    object.id.to_s
  end

  attribute :actor_id do |object|
    object.actor_id.to_s
  end

  attribute :url do |object, params|
    if object.notifiable_type == Constants::NOTIFY_TYPE_TASK
      "/daily_tasks?batch_id=#{object.alt_notifiable_id}&task_id=#{object.notifiable_id}"
    elsif object.notifiable_type == Constants::NOTIFY_TYPE_BATCH &&
          params[:current_user].user_mode != 'worker'
      "/cultivation/batches/#{object.notifiable_id}"
    end
  end

  attribute :messages do |object|
    if object.notifiable_type == Constants::NOTIFY_TYPE_TASK && object.action == 'task_assigned'
      "#{object.actor_name} assigned task \"#{object.notifiable_name}\" to you"
    elsif object.notifiable_type == Constants::NOTIFY_TYPE_TASK && object.action == 'task_unassigned'
      "#{object.actor_name} has unassigned task \"#{object.notifiable_name}\""
    elsif object.notifiable_type == Constants::NOTIFY_TYPE_TASK
      object.notifiable_name
    else
      object.notifiable_name
    end
  end
end

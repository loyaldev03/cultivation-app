class NotificationSerializer
  include FastJsonapi::ObjectSerializer

  attributes :read_at

  attribute :id do |object|
    object.id.to_s
  end

  attribute :actor_id do |object|
    object.actor_id.to_s
  end

  attribute :url do |object|
    if object.notifiable_type == Constants::NOTIFY_TYPE_TASK
      "/cultivation/batches/#{object.alt_notifiable_id}?task_id=#{object.notifiable_id}"
    end
  end

  attribute :messages do |object|
    if object.notifiable_type == Constants::NOTIFY_TYPE_TASK
      "#{object.actor_name} assigned task \"#{object.notifiable_name}\" to you"
    end
  end
end

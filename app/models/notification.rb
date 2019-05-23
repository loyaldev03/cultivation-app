class Notification
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  # John Doe has assigned task "Water Plant" to you.
  field :messages, type: String, default: ''

  # Receiver
  field :recipient_id, type: BSON::ObjectId

  # Initiator
  field :actor_id, type: BSON::ObjectId
  field :actor_name, type: String, default: ''

  # Flag to indicate if notification has been read
  field :read_at, type: Time

  # Reference to the notification record - For url to
  # corresponding record, so user can click on the notification,
  # and it would bring the user to the respective page.
  # E.g. notifiable_type = "Cultivation::Task"
  field :notifiable_id, type: BSON::ObjectId
  field :notifiable_type, type: String, default: ''
end

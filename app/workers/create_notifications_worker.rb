class CreateNotificationsWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(actor_id,
              action,
              recipients,
              notifiable_id,
              notifiable_type,
              notifiable_name,
              alt_notifiable_id = nil,
              alt_notifiable_type = nil,
              alt_notifiable_name = nil)

    @actor_id = actor_id
    @action = action
    @recipients = recipients
    @notifiable_id = notifiable_id
    @notifiable_type = notifiable_type
    @notifiable_name = notifiable_name
    @alt_notifiable_id = alt_notifiable_id
    @alt_notifiable_type = alt_notifiable_type
    @alt_notifiable_name = alt_notifiable_name

    @logger = Logger.new(STDOUT)
    @logger.debug ">>>>>>> CreateNotificationsWorker perform: #{action}"

    verify_args

    records = @recipients.map do |r|
      recipient_id = r.to_bson_id
      {
        recipient_id: recipient_id,
        recipient_name: get_recipient_name(recipient_id),
        actor_id: actor.id,
        actor_name: actor.display_name,
        action: @action,
        notifiable_id: @notifiable_id&.to_bson_id,
        notifiable_type: @notifiable_type,
        notifiable_name: @notifiable_name,
        alt_notifiable_id: @alt_notifiable_id&.to_bson_id,
        alt_notifiable_type: @alt_notifiable_type,
        alt_notifiable_name: @alt_notifiable_name,
      }
    end

    if records.any?
      Notification.create(records)
      @logger.debug ">>>>>>> CreateNotificationsWorker: #{records.size}"
    end
  end

  private

  def verify_args
    raise ArgumentError, 'action' if @action.blank?
    raise ArgumentError, 'recipients' if @recipients.blank?
    raise ArgumentError, 'notifiable_id' if @notifiable_id.blank?
    raise ArgumentError, 'notifiable_type' if @notifiable_type.blank?
    raise ArgumentError, 'notifiable_name' if @notifiable_name.blank?
  end

  def actor
    @actor ||= if @actor_id.nil?
                 OpenStruct.new(id: 'system', display_name: 'System')
               else
                 User.find(@actor_id)
               end
  end

  def notification_recipients
    @notification_recipients ||= User.where(:_id.in => @recipients).to_a
  end

  def get_recipient_name(recipient_id)
    recipient = notification_recipients.detect { |x| x.id == recipient_id }
    recipient&.display_name
  end
end

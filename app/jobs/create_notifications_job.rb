class CreateNotificationsJob < ApplicationJob
  queue_as :low

  attr_reader :args

  def perform(args = {})
    @args = args
    verify_args

    records = args[:recipients].map do |r|
      recipient_id = r.to_bson_id
      {
        recipient_id: recipient_id,
        recipient_name: get_recipient_name(recipient_id),
        actor_id: actor.id,
        actor_name: actor.display_name,
        action: args[:action],
        notifiable_id: args[:notifiable_id].to_bson_id,
        notifiable_type: args[:notifiable_type],
        notifiable_name: args[:notifiable_name],
      }
    end

    if records.any?
      Notification.create(records)
    end
  end

  rescue_from(ArgumentError) do |ex|
    @logger = Logger.new(STDOUT)
    @logger.debug ex
  end

  private

  def verify_args
    raise ArgumentError, 'actor_id' if args[:actor_id].blank?
    raise ArgumentError, 'action' if args[:action].blank?
    raise ArgumentError, 'recipients' if args[:recipients].blank?
    raise ArgumentError, 'notifiable_id' if args[:notifiable_id].blank?
    raise ArgumentError, 'notifiable_type' if args[:notifiable_type].blank?
    raise ArgumentError, 'notifiable_name' if args[:notifiable_name].blank?
  end

  def actor
    @actor ||= User.find(args[:actor_id])
  end

  def recipients
    @recipients ||= User.where(:_id.in => args[:recipients]).to_a
  end

  def get_recipient_name(recipient_id)
    recipient = recipients.detect { |x| x.id == recipient_id }
    recipient&.display_name
  end
end

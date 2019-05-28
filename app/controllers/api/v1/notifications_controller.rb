class Api::V1::NotificationsController < Api::V1::BaseApiController
  def index
    records = Notification.
      where(recipient_id: current_user.id).
      order_by(c_at: :desc).
      limit(15)
    render json: NotificationSerializer.new(
      records,
      params: {current_user: current_user},
    ).serialized_json
  end

  def mark_as_read
    notification = Notification.find_by(
      id: params[:id],
      recipient_id: current_user.id,
    )

    if !notification.read_at
      # Only update read_at once
      notification.read_at = Time.current
      notification.save
    end

    render json: NotificationSerializer.new(
      notification,
      params: {current_user: current_user},
    ).serialized_json
  end
end

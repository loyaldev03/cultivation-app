class DailySystemNotificationWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  attr_reader :current_time

  # NOTE: This worker is responsible to send out system notifications
  # E.g.
  # - batch about to start
  # - unassigned task in batch
  def perform(*args)
    @logger = Logger.new(STDOUT)
    time_travel

    @current_time = Time.current
    @logger.info "Execute DailySystemNotificationWorker @ #{Time.current}"

    notify_batch_about_to_starts

    time_travel_return
  end

  private

  def notify_batch_about_to_starts
    scheduled_batches.each do |batch|
      days_left = (batch.start_date - current_time) / 1.days
      if days_left <= 5
        managers_ids = get_facility_managers(batch)
        action_notify(batch, managers_ids, days_left.round)
      end
    end
  end

  def action_notify(batch, managers_ids, days_left)
    CreateNotificationsWorker.perform_async(
      nil,
      'batch_reminder',
      managers_ids,
      batch.id.to_s,
      Constants::NOTIFY_TYPE_BATCH,
      "#{batch.name} (#{batch.batch_no}) is scheduled to start in #{days_left} days",
    )
  end

  def get_facility_managers(batch)
    users = QueryUsers.call(batch.facility_id).result
    managers = users.reject { |u| u.user_mode == 'worker' }
    if managers.present?
      managers.map { |m| m.id.to_s }
    else
      []
    end
  end

  def scheduled_batches
    @scheduled_batches ||= Cultivation::Batch.
      includes(:facility).
      where(status: Constants::BATCH_STATUS_SCHEDULED)
  end

  def time_travel
    if ENV['ENABLE_TIME_TRAVEL'] == 'yes'
      config = System::Configuration.first
      if config&.enable_time_travel
        @logger.warn "TIME TRAVEL STARTS ACTIVE::#{Time.current}"
        Timecop.travel(config.current_time)
      else
        Timecop.return
      end
    end
  end

  def time_travel_return
    if ENV['ENABLE_TIME_TRAVEL'] == 'yes'
      @logger.warn "TIME TRAVEL RETURN::#{Time.current}"
      Timecop.return
    end
  end
end

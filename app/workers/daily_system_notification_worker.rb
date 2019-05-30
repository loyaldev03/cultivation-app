class DailySystemNotificationWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  attr_reader :current_time

  # NOTE: This worker is responsible to send out system notifications
  # E.g.
  # - batch about to start
  # - unassigned task in batch
  def perform(*args)
    time_travel
    @current_time = Time.current

    notify_batch_about_to_starts
    notify_batch_about_to_move_to_next_stage

    time_travel_return
  end

  private

  def notify_batch_about_to_starts
    scheduled_batches.each do |batch|
      days_left = (batch.start_date - current_time) / 1.days
      if days_left > 0 && days_left <= 5
        managers_ids = get_facility_managers(batch)
        if managers_ids.present?
          action_notify_batch_start(batch, managers_ids, days_left.round)
        else
          raise StandardError.new "Missing manager in facility: \"#{batch.facility.name}\""
        end
      end
    end
  end

  def notify_batch_about_to_move_to_next_stage
    active_batches.each do |batch|
      next_phase = get_next_phase(batch)
      if next_phase.present?
        days_left = (next_phase.start_date - current_time) / 1.days
        if days_left > 0 && days_left <= 1 # Notify
          managers_ids = get_facility_managers(batch)
          action_notify_batch_move(batch, managers_ids, next_phase.phase)
        end
      end
    end
  end

  def get_next_phase(batch)
    query_cmd = Cultivation::QueryBatchPhases.call(batch)
    # Grouping tasks are all the phases
    grouping_tasks = query_cmd.grouping_tasks.reverse
    if grouping_tasks.present?
      curr_idx = grouping_tasks.find_index { |p| current_time >= p.start_date }
      next_idx = curr_idx - 1 # After reverse next item is in-front
      if grouping_tasks.size > next_idx
        grouping_tasks[next_idx]
      end
    end
  end

  def action_notify_batch_start(batch, managers_ids, days_left)
    CreateNotificationsWorker.new.perform(
      nil,
      'batch_start_reminder',
      managers_ids,
      batch.id.to_s,
      Constants::NOTIFY_TYPE_BATCH,
      "#{batch.batch_no} (#{batch.name}) is scheduled to start in #{days_left} days",
    )
  end

  def action_notify_batch_move(batch, managers_ids, phase)
    CreateNotificationsWorker.new.perform(
      nil,
      'batch_move_reminder',
      managers_ids,
      batch.id.to_s,
      Constants::NOTIFY_TYPE_BATCH,
      "#{batch.batch_no} (#{batch.name}) is scheduled to move into '#{phase}' phase tomorrow",
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
      where(status: Constants::BATCH_STATUS_SCHEDULED).to_a
  end

  def active_batches
    @active_batches ||= Cultivation::Batch.
      includes(:facility).
      where(status: Constants::BATCH_STATUS_ACTIVE).to_a
  end

  def time_travel
    if ENV['ENABLE_TIME_TRAVEL'] == 'yes'
      config = System::Configuration.first
      if config&.enable_time_travel
        Timecop.travel(config.current_time)
      else
        Timecop.return
      end
    end
  end

  def time_travel_return
    if ENV['ENABLE_TIME_TRAVEL'] == 'yes'
      Timecop.return
    end
  end
end

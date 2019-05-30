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
    notify_batch_about_to_harvest
    notify_batch_about_to_cure
    notify_batch_about_to_packaging

    time_travel_return
  end

  private

  def notify_batch_about_to_starts
    scheduled_batches.each do |batch|
      days_left = (batch.start_date - current_time) / 1.days
      if days_left > 0 && days_left <= 5 # Notify 5 days before
        managers_ids = get_facility_managers(batch)
        action_notify_batch_start(batch, managers_ids, days_left.round)
      end
    end
  end

  def notify_batch_about_to_move_to_next_stage
    active_batches.each do |batch|
      next_phase = get_next_phase(batch, false)
      if next_phase.present?
        days_left = (next_phase.start_date - current_time) / 1.days
        if days_left > 0 && days_left <= 1 # Notify a day before
          managers_ids = get_facility_managers(batch)
          action_notify_batch_move(batch, managers_ids, next_phase.phase)
        end
      end
    end
  end

  def notify_batch_about_to_harvest
    active_batches.each do |batch|
      next_phase = get_next_phase(batch, true)
      if next_phase.present? && next_phase&.phase == Constants::CONST_HARVEST
        days_left = (next_phase.start_date - current_time) / 1.days
        if days_left > 0 && days_left <= 3 # Notify 3 days before harvest
          managers_ids = get_facility_managers(batch)
          action_notify_batch_harvest(batch, managers_ids, days_left.round)
        end
      end
    end
  end

  def notify_batch_about_to_cure
    active_batches.each do |batch|
      next_phase = get_next_phase(batch, true)
      if next_phase.present? && next_phase&.phase == Constants::CONST_CURE
        days_left = (next_phase.start_date - current_time) / 1.days
        if days_left > 0 && days_left <= 3 # Notify 3 days before cure
          managers_ids = get_facility_managers(batch)
          action_notify_batch_cure(batch, managers_ids, days_left.round)
        end
      end
    end
  end

  def notify_batch_about_to_packaging
    active_batches.each do |batch|
      next_phase = get_next_phase(batch, true)
      if next_phase.present? && next_phase&.phase == Constants::CONST_PACKAGING
        days_left = (next_phase.start_date - current_time) / 1.days
        if days_left > 0 && days_left <= 3 # Notify 3 days before packaging
          managers_ids = get_facility_managers(batch)
          action_notify_batch_packaging(batch, managers_ids, days_left.round)
        end
      end
    end
  end

  def get_next_phase(batch, all_phases)
    query_cmd = Cultivation::QueryBatchPhases.call(batch)
    # Grouping tasks are all the phases
    schedule = if all_phases
                 query_cmd.grouping_tasks.reverse
               else
                 query_cmd.growing_schedules.reverse
               end
    if schedule.present?
      curr_idx = schedule.find_index { |p| current_time >= p.start_date }
      next_idx = curr_idx - 1 # After reverse next item is in-front
      if schedule.size > next_idx
        schedule[next_idx]
      end
    end
  end

  def action_notify_batch_start(batch, managers_ids, days_left)
    if managers_ids.blank?
      raise StandardError.new "Missing manager in facility: \"#{batch.facility.name}\""
      return
    end

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
    if managers_ids.blank?
      raise StandardError.new "Missing manager in facility: \"#{batch.facility.name}\""
      return
    end

    CreateNotificationsWorker.new.perform(
      nil,
      'batch_move_reminder',
      managers_ids,
      batch.id.to_s,
      Constants::NOTIFY_TYPE_BATCH,
      "#{batch.batch_no} (#{batch.name}) is scheduled to move into '#{phase}' phase tomorrow",
    )
  end

  def action_notify_batch_harvest(batch, managers_ids, days_left)
    if managers_ids.blank?
      raise StandardError.new "Missing manager in facility: \"#{batch.facility.name}\""
      return
    end

    CreateNotificationsWorker.new.perform(
      nil,
      'batch_harvest_reminder',
      managers_ids,
      batch.id.to_s,
      Constants::NOTIFY_TYPE_BATCH,
      "#{batch.batch_no} (#{batch.name}) is ready to harvest in #{days_left} days",
    )
  end

  def action_notify_batch_cure(batch, managers_ids, days_left)
    if managers_ids.blank?
      raise StandardError.new "Missing manager in facility: \"#{batch.facility.name}\""
      return
    end

    CreateNotificationsWorker.new.perform(
      nil,
      'batch_cure_reminder',
      managers_ids,
      batch.id.to_s,
      Constants::NOTIFY_TYPE_BATCH,
      "#{batch.batch_no} (#{batch.name}) is ready to cure in #{days_left} days",
    )
  end

  def action_notify_batch_packaging(batch, managers_ids, days_left)
    if managers_ids.blank?
      raise StandardError.new "Missing manager in facility: \"#{batch.facility.name}\""
      return
    end

    CreateNotificationsWorker.new.perform(
      nil,
      'batch_packaging_reminder',
      managers_ids,
      batch.id.to_s,
      Constants::NOTIFY_TYPE_BATCH,
      "#{batch.batch_no} (#{batch.name}) is ready to packaging in #{days_left} days",
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

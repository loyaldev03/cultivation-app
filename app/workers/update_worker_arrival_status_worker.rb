class UpdateWorkerArrivalStatusWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  attr_reader :current_time

  # NOTE: This worker is responsible to update work schedule for non exempt status
  # absent, on-time, late
  # absent - date past end time but no time log yet
  # on-time - start time == time_log.start_time
  # late - time_log.start_time > start_time

  def perform(*args)
    @current_time = Time.current
    hourly_worker = User.where(exempt: false).includes(:time_logs)
    hourly_worker.each do |worker|
      work_schedules = worker.work_schedules.where(arrival_status: nil)
      time_logs = worker.time_logs
      work_schedules.each do |ws|
        time_log = time_logs.select { |a| a.start_time.between?(ws.date.beginning_of_day, ws.date.end_of_day) }.first
        ws_start_time = Time.zone.parse("#{ws.date.strftime('%Y-%m-%d')} #{ws.start_time.strftime('%H:%M')}")
        ws_end_time = Time.zone.parse("#{ws.date.strftime('%Y-%m-%d')} #{ws.start_time.strftime('%H:%M')}")

        if ws_end_time < @current_time
          if time_log.present?
            if time_log.start_time <= ws_start_time
              ws.update(arrival_status: 'ontime')
            else
              ws.update(arrival_status: 'late')
            end
          else
            ws.update(arrival_status: 'absent')
          end
        end
      end
    end
  end
end

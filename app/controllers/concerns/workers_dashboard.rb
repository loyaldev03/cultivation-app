module WorkersDashboard
  extend ActiveSupport::Concern

  included do
  end

  def get_hours_worked
    time_logs = current_user.time_logs.where(
      :start_time.gte => Time.current.beginning_of_week,
      :end_time.lte => Time.current.end_of_week,
    ).to_a

    sum_minutes = 0.0
    time_logs.each do |time_log|
      if time_log.start_time && time_log.end_time
        result = Cultivation::CalculateTaskActualCostAndHours.call(time_log, current_user).result
        sum_minutes += result[:actual_minutes]
      end
    end
    actual_hours = sum_minutes / 60 #convert to hours
    actual_hours.round(2)
  end
end

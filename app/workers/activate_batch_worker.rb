class ActivateBatchWorker
  include Sidekiq::Worker

  def perform(*args)
    time_travel
    @current_time = Time.current

    Cultivation::ActivateBatch.call(@current_time)

    time_travel_return
  end

  private

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

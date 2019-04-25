class ActivateBatchWorker
  include Sidekiq::Worker

  def perform(*args)
    if ENV['ENABLE_TIME_TRAVEL'] == 'yes'
      time_travel
      @logger = Logger.new(STDOUT)
      @logger.debug "Execute Cultivation::ActivateBatch @ #{Time.current}"
      Cultivation::ActivateBatch.call(Time.current)
      time_travel_return
    end
  end

  private

  def time_travel
    config = System::Configuration.first
    if config&.enable_time_travel
      Rails.logger.info 'TIME TRAVEL START'
      Timecop.travel(config.current_time)
    else
      Timecop.return
    end
  end

  def time_travel_return
    Rails.logger.info 'TIME TRAVEL RETURN'
    Timecop.return
  end
end

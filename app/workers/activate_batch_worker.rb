class ActivateBatchWorker
  include Sidekiq::Worker

  def perform(*args)
    @logger = Logger.new(STDOUT)
    @logger.debug "Execute Cultivation::ActivateBatch @ #{Time.current}"
    if ENV['ENABLE_TIME_TRAVEL'] == 'yes'
      @logger.debug "TIME TRAVEL STARTS ACTIVE::#{Time.current}"
      time_travel
    end
    Cultivation::ActivateBatch.call(Time.current)
    if ENV['ENABLE_TIME_TRAVEL'] == 'yes'
      @logger.debug "TIME TRAVEL RETURN ACTIVE::#{Time.current}"
      time_travel_return
    end
  end

  private

  def time_travel
    config = System::Configuration.first
    if config&.enable_time_travel
      Timecop.travel(config.current_time)
    else
      Timecop.return
    end
  end

  def time_travel_return
    Timecop.return
  end
end

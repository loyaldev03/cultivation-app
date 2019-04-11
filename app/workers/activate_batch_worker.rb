class ActivateBatchWorker
  include Sidekiq::Worker

  def perform(*args)
    @logger = Logger.new(STDOUT)
    @logger.debug "Execute Cultivation::ActivateBatch @ #{Time.current}"
    Cultivation::ActivateBatch.call(Time.current)
  end
end

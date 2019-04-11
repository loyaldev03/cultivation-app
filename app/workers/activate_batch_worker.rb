class ActivateBatchWorker
  include Sidekiq::Worker

  def perform(*args)
    Cultivation::ActivateBatch.call(Time.now)
  end
end

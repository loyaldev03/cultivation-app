class ActivateBatchWorker
  include Sidekiq::Worker

  def perform(*args)
    puts "Start => #{Time.now}"
    Cultivation::ActivateBatch.call
    puts "End => #{Time.now}"
  end
end

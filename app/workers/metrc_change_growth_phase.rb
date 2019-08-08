class MetrcChangeGrowthPhase
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id)
    @batch_id = batch_id
    @batch = Cultivation::Batch.find(batch_id)
    movement_histories = @move_to_flower_task.movement_histories
    movement_histories.each do |movement_history|
      movement_history.plants.each do |plant|
        #call api to create
        params = [
          {
            "Name": '1A4FF0000000022000001522',
            "Count": 1,
            "StartingTag": '1A4FF0000000022000001523',
            "GrowthPhase": 'Flowering',
            "NewRoom": 'Plants Room',
            "GrowthDate": '2019-06-11',
          },
        ]
      end
    end
  end

  def move_to_flower_task
    @measure_harvest_task ||= Cultivation::Task.find_by(
      batch_id: @batch_id,
      indelible: Constants::INDELIBLE_MOVING_NEXT_PHASE,
      name: 'Move to flower room',
    )
  end
end

class MetrcChangeGrowthPhase
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id)
    @batch_id = batch_id
    @batch = Cultivation::Batch.find(batch_id)
    @move_to_flower_task = get_move_to_flower_task
    @query_locations = get_query_locations
    @facility = @batch.facility
    license_no = @facility.site_license

    movement_histories = @move_to_flower_task.movement_histories
    movement_histories.each do |movement_history|
      location = @query_locations.get_location(movement_history.destination_id.to_s)
      movement_history.plants.each do |plant| #plants here stores plant_tag
        plant_record = @batch.plants.find_by(plant_id: plant) #find plant by plant tag
        metrc_plant_batch = Metrc::PlantBatch.find_by(batch_id: batch_id)
        params = [
          {
            "Name": metrc_plant_batch.metrc_tag,
            "Count": 1,
            "StartingTag": plant_record.plant_id,
            "GrowthPhase": 'Flowering',
            "NewRoom": location['room_name'], #if we have multiple flower rooms what would happen
            "GrowthDate": Time.current.strftime('%F'),
          },
        ]
        MetrcApi.change_growth_phase(license_no, params)
        # will call api 100 times if we have 100 plant, if it exceed more than 100 should we use another plantbatch ?
      end
    end
  end

  def get_move_to_flower_task
    @phase = get_phase
    Cultivation::Task.find_by(
      batch_id: @batch_id,
      indelible: Constants::INDELIBLE_MOVING_NEXT_PHASE,
      phase: @phase,
    )
  end

  def get_query_locations
    QueryLocations.call(@batch.facility.id.to_s)
  end

  def get_phase
    if @facility.purposes.include?(Constants::CONST_VEG1) && @facility.purposes.include?(Constants::CONST_VEG2)
      Constants::CONST_VEG2
    else
      Constants::CONST_VEG
    end
  end
end

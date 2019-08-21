class MetrcUpdateHarvestPlant
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id)
    @batch_id = batch_id
    @batch = Cultivation::Batch.find(batch_id)

    if measure_harvest_task && measure_harvest_task.work_status != Constants::WORK_STATUS_DONE
      return 0
    end

    harvest_batch = @batch.harvest_batch.first
    if harvest_batch.present?
      license_no = @batch.facility.site_license
      harvest_params = harvest_batch.plants.each do |plant|
        {
          "Plant": plant.plant_tag,
          "Weight": plant.wet_weight,
          "UnitOfWeight": harvest_batch.uom_name,
          "DryingRoom": plant.metrc_room_name,
          "HarvestName": harvest_batch.harvest_name,
          "ActualDate": Time.current.strftime('%F'),
        }
      end
      MetrcApi.create_harvestplants(license_no, harvest_params)
    end
  end

  def measure_harvest_task
    @measure_harvest_task ||= Cultivation::Task.find_by(
      batch_id: @batch_id,
      indelible: Constants::INDELIBLE_MEASURE_HARVEST,
    )
  end
end

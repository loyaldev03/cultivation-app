class MetrcDestroyImmaturePlant
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(plant_id)
    plant = Inventory::Plant.find(plant_id)
    facility = plant.facility_strain.facility
    license = facility.site_license
    params = [
      {
        "PlantBatch": plant.plant_batch_name,
        "Count": 1,
        "ReasonNote": plant.destroyed_reason,
        "ActualDate": plant.destroyed_date,
      },
    ]
    results = MetrcApi.destroy_immature_plant(license, params)
  end
end

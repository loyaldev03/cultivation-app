class MetrcDestroyFlowerPlant
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(plant_id)
    plant = Inventory::Plant.find(plant_id)
    facility = plant.facility_strain.facility
    license = facility.site_license
    params = [
      {
        "Id": plant.id,
        "Label": plant.plant_tag,
        "ReasonNote": plant.destroyed_reason,
        "ActualDate": plant.destroyed_date,
      },
    ]
    results = MetrcApi.destroy_flower_plant(license, params)
  end
end

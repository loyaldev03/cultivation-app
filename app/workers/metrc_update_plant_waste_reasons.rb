class MetrcUpdatePlantWasteReasons
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    # Download Unit of Measures (UoM) list from Metrc via API
    results = MetrcApi.get_plant_waste_reasons
    results.each do |h|
      # Parse downloaded data, and map to local UoM model
      found = Cultivation::PlantWasteReason.find_or_create_by(
        name: h['Name'],
      )
      found.requires_note = h['RequiresNote']
      found.save
    end
  end
end

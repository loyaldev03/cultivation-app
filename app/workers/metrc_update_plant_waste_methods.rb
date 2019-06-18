class MetrcUpdatePlantWasteMethods
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    # Download Unit of Measures (UoM) list from Metrc via API
    results = MetrcApi.get_plant_waste_methods
    results.each do |h|
      # Parse downloaded data, and map to local UoM model
      Cultivation::PlantWasteMethod.find_or_create_by(
        name: h['Name'],
      )
    end
  end
end

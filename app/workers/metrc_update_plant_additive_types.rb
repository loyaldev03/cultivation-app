class MetrcUpdatePlantAdditiveTypes
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    # Download Unit of Measures (UoM) list from Metrc via API
    results = MetrcApi.get_plant_additives_types
    results.each do |h|
      # Parse downloaded data, and map to local UoM model
      Cultivation::PlantAdditiveTypes.find_or_create_by(
        name: h,
      )
    end
  end
end

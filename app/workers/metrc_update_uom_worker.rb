class MetrcUpdateUomWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    # Download Unit of Measures (UoM) list from Metrc via API
    results = MetrcApi.get_unit_of_measure
    results.each do |h|
      # Parse downloaded data, and map to local UoM model
      uom = Common::UnitOfMeasure.find_or_create_by(
        name: h['Name'],
        unit: h['Abbreviation'],
      )
      qty_type = h['QuantityType']
      uom.dimension = if qty_type == 'CountBased'
                        'pieces'
                      elsif qty_type == 'VolumeBased'
                        'volume'
                      elsif qty_type == 'WeightBased'
                        'weight'
                      end

      if uom.dimension
        # Update changes to database, create if not exists,
        uom.is_metrc = true
        uom.save!
      end
    end
  end
end

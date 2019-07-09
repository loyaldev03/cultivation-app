class MetrcUpdateUomWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    # Download Unit of Measures (UoM) list from Metrc via API
    results = MetrcApi.get_unit_of_measure
    results.each do |h|
      # Parse downloaded data, and map to local UoM model
      uom = Common::UnitOfMeasure.find_or_initialize_by(
        name: h['Name'],
        unit: h['Abbreviation'],
      )
      uom.quantity_type = h['QuantityType']
      uom.dimension = if uom.quantity_type == Constants::UOM_QTY_TYPE_COUNT
                        Constants::UOM_DMS_PIECES
                      elsif uom.quantity_type == Constants::UOM_QTY_TYPE_VOLUME
                        Constants::UOM_DMS_VOLUME
                      elsif uom.quantity_type == Constants::UOM_QTY_TYPE_WEIGHT
                        Constants::UOM_DMS_WEIGHT
                      end
      if uom.dimension
        # Update changes to database
        uom.is_metrc = true
        uom.save!
      end
    end
  end
end

module Inventory
  class HarvestBatch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :harvest_name, type: String
    field :harvest_date, type: DateTime
    field :total_wet_weight, type: BigDecimal
    field :total_wet_waste_weight, type: BigDecimal
    field :uom, type: String
    field :status, type: String                 # new, closed (when fully packaged)

    has_many :plants, class_name: 'Inventory::Plant'
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch', optional: true
  end
end

# TODO: To be removed
module Inventory
  class HarvestBatch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :harvest_name, type: String
    field :harvest_date, type: DateTime
    field :total_wet_weight, type: Float, default: -> { 0 }
    field :total_wet_waste_weight, type: Float, default: -> { 0 }
    field :uom, type: String
    field :status, type: String                 # new, closed (when fully packaged)

    has_many :plants, class_name: 'Inventory::Plant'
    has_many :packages, class_name: 'Inventory::ItemTransaction'  # These are packages created from harvest after it has done drying & curing.
                                                                  # For now, it has some edge cases, immature plant and grown plants to be sold are also parked here.

    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch'
  end
end

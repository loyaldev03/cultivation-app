module Inventory
  class HarvestBatch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :harvest_name, type: String
    field :harvest_date, type: Time
    field :total_wet_weight, type: Float, default: -> { 0 }
    field :total_wet_waste_weight, type: Float, default: -> { 0 }

    field :total_trim_weight, type: Float, default: -> { 0 }
    field :total_trim_waste_weight, type: Float, default: -> { 0 } #dry waste change this
    field :total_dry_weight, type: Float, default: -> { 0 }  # Weight after finish drying
    field :total_cure_weight, type: Float, default: -> { 0 } # Weight after finish curing
    field :uom, type: String
    field :uom_name, type: String
    field :status, type: String                 # new, closed (when fully packaged)
    field :location_id, type: BSON::ObjectId

    has_many :plants, class_name: 'Inventory::Plant'
    has_many :packages, class_name: 'Inventory::ItemTransaction'  # These are packages created from harvest after it has done drying & curing.
                                                                  # For now, it has some edge cases, immature plant and grown plants to be sold are also parked here.

    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch'
  end
end

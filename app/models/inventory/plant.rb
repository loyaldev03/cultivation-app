module Inventory
  class Plant
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    # Seed data for prepurchased clone

    belongs_to :created_by, class_name: 'User'
    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch', optional: true
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    belongs_to :harvest_batch, class_name: 'Inventory::HarvestBatch', optional: true

    # belongs_to :manicure_batch,     class_name: 'Cultivation::ManicureBatch', optional: true
    # has_many :item_histories

    belongs_to :vendor_invoice, class_name: 'Inventory::VendorInvoice', optional: true

    field :plant_id, type: String
    field :plant_tag, type: String
    field :location_id, type: BSON::ObjectId
    field :location_type, type: String
    field :status, type: String
    field :current_growth_stage, type: String   # mother, clone, veg, veg1, veg2, flower, harvested, destroyed
    field :mother_date, type: DateTime
    field :planting_date, type: DateTime
    field :veg_date, type: DateTime
    field :veg1_date, type: DateTime
    field :veg2_date, type: DateTime
    field :flower_date, type: DateTime
    field :harvest_date, type: DateTime
    field :expected_harvest_date, type: DateTime
    field :destroyed_date, type: DateTime
    field :mother_id, type: BSON::ObjectId

    field :wet_weight, type: BigDecimal, default: 0
    field :wet_waste_weight, type: BigDecimal, default: 0
    field :wet_weight_uom, type: String

    field :last_metrc_update, type: DateTime
    field :ref_id, type: BSON::ObjectId
    field :ref_type, type: String
  end
end

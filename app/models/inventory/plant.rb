module Inventory
  class Plant
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include Mongoid::History::Trackable

    # Seed data for prepurchased clone

    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch', optional: true
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    belongs_to :harvest_batch, class_name: 'Inventory::HarvestBatch', optional: true
    belongs_to :vendor_invoice, class_name: 'Inventory::VendorInvoice', optional: true

    # plant_id is the internal ID use by cultivator, wher METRC ID isn't available.
    # However, in most cases, plant_id would be same as plant_tag
    field :plant_id, type: String # e.g. MOT-AK47-001
    field :plant_tag, type: String # METRC Tag
    field :location_id, type: BSON::ObjectId
    field :location_type, type: String
    field :status, type: String
    # mother, clone, veg, veg1, veg2, flower
    field :current_growth_stage, type: String
    field :mother_date, type: Time
    field :planting_date, type: Time
    field :veg_date, type: Time
    field :veg1_date, type: Time
    field :veg2_date, type: Time
    field :flower_date, type: Time
    field :harvest_date, type: Time
    field :expected_harvest_date, type: Time
    field :destroyed_date, type: Time
    field :destroyed_reason, type: String
    field :mother_id, type: BSON::ObjectId
    # metrc require big batch to split into multiple lot
    field :lot_number, type: String

    field :wet_weight, type: Float, default: -> { 0.0 }
    field :wet_waste_weight, type: Float, default: -> { 0.0 }
    field :wet_weight_uom, type: String

    field :last_metrc_update, type: DateTime

    # E.g. If plant is purchased, this would like to invoice item
    # E.g. If grown from clipping, this would be nil
    field :ref_id, type: BSON::ObjectId
    field :ref_type, type: String

    track_history on: [:plant_tag,
                       :location_id,
                       :location_type,
                       :status,
                       :current_growth_stage,
                       :planting_date,
                       :estimated_harvest_date,
                       :destroyed_date,
                       :mother_date,
                       :mother_id,
                       :lot_number,
                       :wet_weight,
                       :wet_waste_weight,
                       :wet_weight_uom],
                  modifier_field: :modifier,
                  modifier_field_inverse_of: nil,
                  modifier_field_optional: true,
                  tracker_class_name: :plant_history_tracker
  end
end

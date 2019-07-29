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

    # E.g. If plant is purchased, this would like to invoice item
    # E.g. If grown from clipping, this would be nil
    field :ref_id, type: BSON::ObjectId
    field :ref_type, type: String

    # Metrc related fields
    # PlantBatchName on Metrc (this is a Metrc Plant Tag in CA)
    field :metrc_id, type: Integer
    field :metrc_state, type: String
    field :metrc_growth_phase, type: String
    field :plant_batch_id, type: Integer
    field :plant_batch_name, type: String
    field :metrc_strain_name, type: String
    field :metrc_room_name, type: String
    field :metrc_harvest_id, type: Integer
    field :metrc_harvest_count, type: Integer
    field :metrc_harvest_uom, type: String
    field :metrc_harvest_uom_abbr, type: String
    field :metrc_harvest_wet_weight, type: String
    field :metrc_is_on_hold, type: Boolean, default: -> { false }
    field :metrc_planted_date, type: String
    field :metrc_veg_date, type: String
    field :metrc_flower_date, type: String
    field :metrc_harvested_date, type: String
    field :metrc_destroyed_date, type: String
    # Last time this record was updated from Metrc
    field :last_metrc_update, type: DateTime

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

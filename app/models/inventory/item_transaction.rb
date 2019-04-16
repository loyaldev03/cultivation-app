module Inventory
  class ItemTransaction
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include ConvertQuantity

    field :plant_id, type: BSON::ObjectId       # might be removed if no ID assigned
    # TODO: Create index for ref_id + ref_type
    field :ref_id, type: BSON::ObjectId
    field :ref_type, type: String
    field :event_type, type: String             # stock_intake, materials_used, material_waste
    field :event_date, type: DateTime

    field :product_name, type: String
    field :description, type: String
    field :manufacturer, type: String

    field :quantity, type: Float, default: -> { 0 }           # can be +/-
    field :uom, type: String
    field :common_quantity, type: Float, default: -> { 0 }
    field :common_uom, type: String
    field :order_quantity, type: Float, default: -> { 0 }
    field :order_uom, type: String
    field :conversion, type: Float, default: -> { 0 }
    field :location_id, type: BSON::ObjectId

    # Subset fields for (sales product) packages
    field :package_tag, type: String
    field :production_date, type: DateTime
    field :expiration_date, type: DateTime
    field :other_harvest_batch, type: String    # for package which harvest no longer available
    field :drawdown_quantity, type: Float, default: -> { 0 }   # how much was taken from harvest
    field :drawdown_uom, type: String
    field :cost_per_unit, type: Float, default: -> { 0 }       # this cost per unit is cost for each quantity

    field :breakdowns, type: Array

    field :created_by, type: BSON::ObjectId #whodunnit

    belongs_to :facility
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true
    belongs_to :catalogue, class_name: 'Inventory::Catalogue'

    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch', optional: true
    belongs_to :harvest_batch, class_name: 'Inventory::HarvestBatch', optional: true
    belongs_to :product, class_name: 'Inventory::Product', optional: true
    # TODO: Missing link to Cultivation::Batch
    # TODO: Missing fields for standard amount and quantity
  end
end

# ---------------------------------------------
# catalogue,    qty, uom, event_type,   date
# ---------------------------------------------
# small-table,   5,  ea,  stock_intake, 1 dec
# small-table,  -1,  ea,  damaged,      25 dec

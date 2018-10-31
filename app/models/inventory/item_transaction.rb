module Inventory
  class ItemTransaction
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :plant_id, type: BSON::ObjectId     # might be removed if no ID assigned
    field :ref_id, type: BSON::ObjectId
    field :ref_type, type: String
    field :event_type, type: String           # stock_intake, materials_used
    field :event_date, type: DateTime
    field :product_name, type: String
    field :description, type: String
    field :manufacturer, type: String
    field :quantity, type: BigDecimal         # can be +/-
    field :uom, type: String
    field :order_quantity, type: BigDecimal
    field :order_uom, type: String
    field :conversion, type: BigDecimal
    field :location_id, type: BSON::ObjectId

    belongs_to :facility, optional: true
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true
    belongs_to :catalogue, class_name: 'Inventory::Catalogue'
  end
end

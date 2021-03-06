# This model represents product that is sold/ transferable by
# a facility.

module Inventory
  class Product
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :sku, type: String
    field :status, type: String    # available, draft
    field :transaction_limit, type: Float, default: -> { 0 }
    field :description, type: String
    field :manufacturer, type: String
    # This replaces the one in Inventory::Catalogue
    field :uom_dimension, type: String
    field :common_uom, type: String

    field :order_quantity, type: Float
    field :order_uom, type: String

    field :size, type: Float, default: -> { 0 }
    field :package_type, type: String
    field :ppm, type: Integer

    field :upc, type: String
    field :model, type: String
    field :epa_number, type: String # => nutrients , supplements

    field :average_price, type: Float, default: -> { 0 }

    embeds_many :nutrients, as: :nutrition, class_name: 'Inventory::Nutrient'
    embeds_many :attachments, as: :attachable, class_name: 'FileAttachment'

    has_many :packages, class_name: 'Inventory::ItemTransaction'
    belongs_to :catalogue, class_name: 'Inventory::Catalogue'
    belongs_to :facility, class_name: 'Facility'

    # Strain is optional because a product that is a combination of
    # multiple product has more than one strain.
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true

    def uoms
      Common::UnitOfMeasure.where(dimension: self.uom_dimension)
    end
  end
end

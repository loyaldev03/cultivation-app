# This model represents product that is sold/ transferable by
# a facility.

module Inventory
  class Product
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :sku, type: String
    field :status, type: String    # available, draft
    field :transaction_limit, type: BigDecimal
    field :description, type: String
    field :manufacturer, type: String
    # This replaces the one in Inventory::Catalogue
    field :uom_dimension, type: String

    embeds_many :nutrients, as: :nutrition, class_name: 'Inventory::Nutrient'
    has_many :packages, class_name: 'Inventory::ItemTransaction'
    belongs_to :catalogue, class_name: 'Inventory::Catalogue'
    belongs_to :facility, class_name: 'Facility'

    # Strain is optional because a product that is a combination of multiple product has more
    # than one strain.
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true
  end
end

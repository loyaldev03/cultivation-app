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

    has_many :packages, class_name: 'Inventory::ItemTransaction'
    belongs_to :catalogue, class_name: 'Inventory::Catalogue'
    belongs_to :facility, class_name: 'Facility'
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
  end
end

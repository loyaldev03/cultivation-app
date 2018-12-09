# This model represents product that is sold/ transferable by
# a facility.

module Inventory
  class Product
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :product_code, type: String
    field :facility_id, type: BSON::ObjectId
    field :status, type: String

    has_many :packages, class_name: 'Inventory::ItemTransaction'
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    belongs_to :catalogue, class_name: 'Common::Catalogue'
  end
end

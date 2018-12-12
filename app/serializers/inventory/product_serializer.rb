module Inventory
  class ProductSerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :sku, :status

    attribute :catalogue_id do |object|
      object.catalogue_id.to_s
    end

    attribute :facility_id do |object|
      object.facility_id.to_s
    end

    attribute :facility_strain_id do |object|
      object.facility_strain_id.to_s
    end
  end
end

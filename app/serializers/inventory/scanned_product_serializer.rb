module Inventory
  class ScannedProductSerializer
    include FastJsonapi::ObjectSerializer

    attributes :package_tag,
      :quantity,
      :uom,
      :package_type

    attribute :id do |object|
      object.id.to_s
    end

    attribute :harvest_batch_id do |object|
      object.harvest_batch_id.to_s
    end

    attribute :location_id do |object|
      object.location_id.to_s
    end

    attribute :catalogue do |object|
      {
        id: object.catalogue_id.to_s,
        label: object.catalogue.label,
      }
    end

    attribute :product_id do |object|
      object.product_id.to_s
    end

    # attribute :product do |object|
    #   product = object.product
    #   {
    #     id: product.id.to_s,
    #     name: product.name,
    #     sku: product.sku,
    #     catalogue_id: product.catalogue_id.to_s,
    #     facility_strain_id: product.facility_strain_id&.to_s,
    #     facility_id: product.facility_id.to_s,
    #     transaction_limit: product.transaction_limit,
    #   }
    # end
  end
end

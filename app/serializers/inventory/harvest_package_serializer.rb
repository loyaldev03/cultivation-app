module Inventory
  class HarvestPackageSerializer
    include FastJsonapi::ObjectSerializer

    attributes :package_tag,
      :quantity,
      :uom,
      :other_harvest_batch,
      :drawdown_quantity,
      :drawdown_uom,
      :cost_per_unit

    attribute :harvest_batch_id do |object|
      object.harvest_batch_id.to_s
    end

    attribute :location_id do |object|
      object.location_id.to_s
    end

    attribute :production_date do |object|
      object.production_date.iso8601
    end

    attribute :expiration_date do |object|
      object.expiration_date.iso8601
    end

    attribute :catalogue do |object|
      {
        id: object.catalogue_id.to_s,
        label: object.catalogue.label,
      }
    end

    attribute :product do |object|
      product = object.product
      {
        id: product.id.to_s,
        name: product.name,
        sku: product.sku,
        catalogue_id: product.catalogue_id.to_s,
        facility_strain_id: product.facility_strain_id&.to_s,
        transaction_limit: product.transaction_limit,
      }
    end
  end
end

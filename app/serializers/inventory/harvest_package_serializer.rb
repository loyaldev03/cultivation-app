# TODO: To consider to be replace
module Inventory
  class HarvestPackageSerializer
    include FastJsonapi::ObjectSerializer

    attributes :package_tag,
      :quantity,
      :uom,
      :other_harvest_batch,
      :drawdown_quantity,
      :drawdown_uom,
      :cost_per_unit,
      :breakdowns

    attributes :id do |object|
      object.id&.to_s
    end
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
      object&.expiration_date&.iso8601
    end

    attribute :catalogue do |object|
      {
        id: object.catalogue_id.to_s,
        label: object.catalogue.label,
      }
    end

    attribute :catalogue_id do |object|
      object.catalogue_id.to_s
    end

    attribute :label do |object|
      object.catalogue.label
    end

    attribute :location_name do |object, params|
      if params[:query] && object.location_id
        params[:query].get_location_code(object.location_id)
      else
        ''
      end
    end

    attribute :package_name do |object|
      object.product.name
    end

    attribute :genome_type do |object|
      object.product.facility_strain&.strain_type
    end

    attribute :strain do |object|
      object.product.facility_strain&.strain_name
    end

    attribute :thc do |object|
      object.product.facility_strain&.thc
    end

    attribute :cbd do |object|
      object.product.facility_strain&.cbd
    end

    attribute :package_type do |object|
      object.product.package_type
    end

    attribute :product do |object|
      product = object.product
      {
        id: product.id.to_s,
        name: product.name,
        sku: product.sku,
        package_type: product.package_type,
        catalogue_id: product.catalogue_id.to_s,
        facility_strain_id: product.facility_strain_id&.to_s,
        facility_id: product.facility_id.to_s,
        transaction_limit: product.transaction_limit,
      }
    end
  end
end

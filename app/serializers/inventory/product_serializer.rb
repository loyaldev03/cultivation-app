module Inventory
  class ProductSerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :sku, :status, :transaction_limit, :manufacturer, :description, :size, :common_uom, :ppm, :uom_dimension, :epa_number, :upc

    attribute :id do |object|
      object.id.to_s
    end

    attribute :catalogue_id do |object|
      object.catalogue_id.to_s
    end

    attribute :catalogue do |object|
      object.catalogue if object.catalogue
    end

    attribute :uoms do |object|
      object.uoms.pluck(:unit)
    end

    attribute :facility_id do |object|
      object.facility_id.to_s
    end

    attribute :facility_strain_id do |object|
      object.facility_strain_id.to_s
    end

    attribute :nitrogen do |object|
      object.nutrients.detect { |a| a[:element] == 'nitrogen' }&.value
    end

    attribute :prosphorus do |object|
      object.nutrients.detect { |a| a[:element] == 'prosphorus' }&.value
    end

    attribute :potassium do |object|
      object.nutrients.detect { |a| a[:element] == 'potassium' }&.value
    end

    attribute :nutrients do |object|
      elements = ['nitrogen', 'prosphorus', 'potassium']
      object.nutrients.select { |a| !elements.include?(a[:element]) }.map { |a| {element: a[:element], value: a[:value]} }
    end

    attribute :attachments do |object|
      object.attachments.map do |file|
        {
          id: file.id.to_s,
          url: file.file_url(expires_in: 3600),
          mime_type: file.file_mime_type,
          data: file.file_data,
          filename: file.file_filename,
        }
      end
    end
  end
end

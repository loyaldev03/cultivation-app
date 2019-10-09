module Inventory
  class ProductCategorySerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :quantity_type, :is_used, :is_active, :metrc_item_category, :deleted

    attribute :id do |object|
      object.id.to_s
    end

    attribute :sub_categories do |object|
      object.sub_categories.map do |sub|
        package_units = sub.package_units.map { |u| {value: u.value, label: u.label, uom: {label: u.uom&.capitalize, value: u.uom}, quantity: u.quantity_in_uom} }
        {
          id: sub.id.to_s,
          name: sub.name,
          product_category_id: object.id.to_s,
          product_category_name: object.name,
          package_units: package_units,
        }
      end
    end

    attribute :package_units do |object|
      object.package_units.map do |pu|
        {
          id: pu.id.to_s,
          value: pu.value,
          label: pu.label,
          uom: {label: pu.uom, value: pu.uom},
          quantity: pu.quantity_in_uom,
        }
      end
    end
  end
end

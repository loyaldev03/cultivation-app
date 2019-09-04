module Inventory
  class CatalogueSerializer
    include FastJsonapi::ObjectSerializer

    attributes :label, :is_active, :category, :sub_category

    attribute :key do |object|
      object.id.to_s
    end

    attribute :name do |object|
      object.label
    end

    attribute :uoms do |object, params|
      uoms = params[:uoms].select { |u| u.dimension == object.uom_dimension }
      uoms.map { |x| {label: x.name, value: x.name} }
    end
  end
end

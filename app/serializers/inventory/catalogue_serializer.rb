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
  end
end

module Inventory
  class RawMaterialSerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :is_active, :category, :sub_category
  end
end

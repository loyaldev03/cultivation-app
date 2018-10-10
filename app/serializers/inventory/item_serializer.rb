module Inventory
  class ItemSerializer
    include FastJsonapi::ObjectSerializer

    attributes :name, :quantity, :uom
  end
end

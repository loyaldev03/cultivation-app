module Cultivation
  class Item
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    embedded_in :task, class_name: 'Cultivation::Task'

    field :name, type: String
    field :quantity, type: Integer
    field :uom, type: String

    belongs_to :raw_material, class_name: 'Inventory::RawMaterial'
  end
end

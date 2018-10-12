module Inventory
  class ItemTransaction
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :quantity, type: Integer #can be +/-
    field :uom, type: String
    field :trans_type, type: String #manual/purchase

    belongs_to :item, class_name: 'Inventory::Item', optional: true
  end
end

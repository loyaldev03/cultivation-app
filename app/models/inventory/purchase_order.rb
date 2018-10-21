module Inventory
  class PurchaseOrder
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :purchase_order_no, type: String
    field :purchase_order_date, type: DateTime
    field :status, type: String        # { draft, approved, completed, canceled }
    field :completed_date, type: DateTime      # When PO is fully delivered, the completed date is added.

    belongs_to :facility
    belongs_to :vendor, class_name: 'Inventory::Vendor'
    has_many :items, class_name: 'Inventory::PurchaseOrderItem'
  end
end

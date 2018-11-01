module Inventory
  class PurchaseOrder
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    DRAFT = 'draft'
    READY = 'ready'
    APPROVED = 'approved'
    RECEIVED_PARTIAL = 'received_partial'
    RECEIVED_FULL = 'received_full'
    INVENTORY_SETUP = 'inventory_setup'

    field :purchase_order_no, type: String
    field :purchase_order_date, type: DateTime
    field :status, type: String        # { draft, approved, completed, canceled }
    field :completed_date, type: DateTime      # When PO is fully delivered, the completed date is added.

    belongs_to :facility
    belongs_to :vendor, class_name: 'Inventory::Vendor'
    has_many :items, class_name: 'Inventory::PurchaseOrderItem', dependent: :delete

    validates_uniqueness_of :purchase_order_no, scope: :vendor

    def total_amount
      0
    end
  end
end

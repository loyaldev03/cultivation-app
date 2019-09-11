module Sales
  class PackageOrder
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :order_no, type: String
    field :status, type: String #default new

    has_many :harvest_packages, class_name: 'Inventory::ItemTransaction', foreign_key: :package_order_id
    belongs_to :customer

    def self.get_next_order_no
      po = Sales::PackageOrder.last
      if po.present?
        next_order = po.order_no.to_s
        next_order.slice!('ORD')
        next_order = next_order.to_i
        next_order += 1
        "ORD#{next_order}"
      else
        'ORD1'
      end
    end
  end
end

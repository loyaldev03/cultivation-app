module Inventory
  class Item
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :description, type: String

    field :item_type, type: String  # Possible values: plant, waste, harvest, seed, storage, raw_materials, sales, non_sales, others
                                    #
                                    # Note:
                                    # Anything related to a strain should use item_type either plant, waste or harvest.
                                    # Use 'plant' when it is an active plant.
                                    # Use 'seed' when the it has not germinated. Seed is a special kind of raw material.

    belongs_to :uom, class_name: 'Common::UnitOfMeasure', optional: true
    belongs_to :facility

    # has_many :articles, class_name: 'Inventory::ItemArticle'
    has_many :item_transactions, class_name: 'Inventory::ItemTransaction'

    # name                          -> product name
    # nutrient type                 -> raw_materials
    # nitrogen product (sub_type)   -> subtype
    # manufacturer                  -> manufacturer
    # desc                          -> desc
    # purchase_uom                  -> purchase_uom   (bag, etc)

    # item-tx
    # invoice_id
    # invoice_item_id               -----> purchase qty, purchase_uom, price_per_item
    # material_uom
    # material_qty

    # nutrient = Item.find(id)
    # qty_per_item = 100
    # uom_per_item = nutrient.uom

    # vi = VendorInvoice.new(
    #   vendor: Vendor.find(1),
    #   invoice_no: 'xxxx1',
    #   po_no: '1a',
    #   invoice_date: Date.today
    # )

    # vi_item = vi.add_raw_material(
    #   item: nutrient,
    #   purchase_qty: 40,
    #   purchase_uom: 'bag',
    #   price_per_item: 4.5,
    #   material_qty: 40 * 100
    #   material_uom: nutrient.uom
    # )

    # tx = PurchaseInventory.call(
    #   item: nutrient,
    #   purchase_qty: 40,
    #   purchase_uom: 'bag',
    #   price_per_item: 4.5,
    #   material_qty: 40 * 100
    #   material_uom: nutrient.uom
    #   invoice_id: vi.id,
    #   invoice_item_id: vi_item.id,
    #   tx_type: 'purchase'
    # )  # need to check for duplicate or not...

    # # SaveItemInvoice.call(user, plants, vendor, invoice_no, purchase_date, purchase_order_no)

  end
end

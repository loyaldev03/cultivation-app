desc "Create dummy facility 1 at a time"
task seed_until_po: :environment  do
  # facility = Facility.create!(name: 'Facility 1', code: 'F1', is_complete: true)

  # Setup the nutrient catalogue
  #   - Nutrients
  #     - Blend
  #     - Potassium
  #       - Seaweed
  #     - Nitrogen
  #       - Blood Meal
  #       - Urea
  #   - Supplements
  #   - Grow Light
  #   
  #   Others
  #   Sales Product
  # 

  # nutrient  = Inventory::Catalogue.create!( label: 'Nutrients',
  #                                           catalogue_type: 'raw_materials',
  #                                           category: '', 
  #                                           sub_category: '', 
  #                                           key: 'nutrients',
  #                                           facility: facility)

  # potassium = Inventory::Catalogue.create!( label: 'Potassium Product', 
  #                                           catalogue_type: 'raw_materials',
  #                                           category: 'nutrients', 
  #                                           sub_category: '', 
  #                                           key: 'potassium',
  #                                           facility: facility)

  # seaweed   = Inventory::Catalogue.create!( label: 'Seaweed', 
  #                                           catalogue_type: 'raw_materials',
  #                                           category: 'nutrients', 
  #                                           sub_category: 'potassium', 
  #                                           key: 'seaweed', 
  #                                           facility: facility)

  # nitrogen  = Inventory::Catalogue.create!( label: 'Nitrogen Product', 
  #                                           catalogue_type: 'raw_materials',
  #                                           category: 'nutrients', 
  #                                           sub_category: '', 
  #                                           key: 'nitrogen',
  #                                           facility: facility)

  # blood_meal = Inventory::Catalogue.create!(label: 'Nitrogen Product', 
  #                                           catalogue_type: 'raw_materials',
  #                                           category: 'nutrients', 
  #                                           sub_category: 'nitrogen', 
  #                                           key: 'blood_meal',
  #                                           facility: facility)

  # urea      = Inventory::Catalogue.create!( label: 'Nitrogen Product', 
  #                                           catalogue_type: 'raw_materials',
  #                                           category: 'nutrients', 
  #                                           sub_category: 'nitrogen', 
  #                                           key: 'urea',
  #                                           facility: facility)


  # grow_lights = Inventory::Catalogue.create!( label: 'Grow Lights',
  #                                           catalogue_type: 'raw_materials',
  #                                           category: '', 
  #                                           sub_category: '', 
  #                                           key: 'grow_lights',
  #                                           facility: facility)

  # eye_drops  = Inventory::Catalogue.create!(label: 'Eye drops',
  #                                           catalogue_type: 'raw_materials',
  #                                           category: '', 
  #                                           sub_category: '', 
  #                                           key: 'eye_drops',
  #                                           facility: facility)

  # vendor = Inventory::Vendor.first
  # po =        Inventory::PurchaseOrder.new( purchase_order_no:  'PO001',
  #                                           purchase_order_date: 50.days.ago,
  #                                           vendor: vendor,
  #                                           facility: facility,
  #                                           status: 'approved')

  # po.items << Inventory::PurchaseOrderItem.new(catalogue: seaweed,
  #                                           quantity: 5,
  #                                           uom: UOM.units.find('bags')
  #                                           price: 5,
  #                                           currency: 'USD'
  #                                           tax: 0,
  #                                           product_name: 'xyz',
  #                                           brand: 'xxx',
  #                                           description: 'i can be anything')
  # po.save!

  # # Receive invoice
  # invoice   = Inventory::VendorInvoice.new( invoice_no: 'IV000010', 
  #                                           invoice_date: 10.days.ago, 
  #                                           vendor: vendor)

  # invoice.items << Inventory::VendorInvoiceItem.new(
  #                                           catalogue: seaweed,
  #                                           quantity: 25,
  #                                           uom: UOM.units.find('bags')
  #                                           price: 5, 
  #                                           tax: 0,
  #                                           brand: 'xxx',
  #                                           product_name: 'xyz',
  #                                           description: 'i can be anything'
  #                                           )

  # invoice.save!
  
  # # When taking stock intake, matching with Invoice
  
  # invoice.items.each do |item|
  #   material_uom = Uom.weight.find('kg')
  #   bag_to_gram = 850  # 850g per bag << user input in stock intake

  #   Inventory::Item.find_or_create_by!(
  #     catalogue: seaweed,
  #     brand: item.brand,
  #     uom: material_uom
  #     # Order uom
  #     # material uom
  #     # conversion rule...
  #     expected_material_qty: 850 * 20,
  #     expected_material_uom: UOM.units.find('g')
  #   )

  #   Inventory::ItemTransaction.create!(
  #     catalogue: seaweed,
  #     brand: item.brand,
  #     material_quantity: material_uom.to(item.quantity * 20, 'g', 'kg')
  #     material_uom: material_uom,
  #     transaction_type: 'stock_intake',
  #     ref_id: item.id,
  #     ref_type: 'Inventory::VendorInvoiceItem'
  #   )
end
desc "Create dummy facility 1 at a time"
task seed_until_po: :environment  do

  # 1. Setup facility
  facility = Facility.find_or_create_by(name: 'Facility 1', code: 'F1') do |f|
    f.is_complete = true
  end

  # 1.1. Reset data
  Inventory::Catalogue.where(facility: facility).delete_all
  Inventory::PurchaseOrder.where(facility: facility).delete_all
  Inventory::VendorInvoice.where(facility: facility).delete_all
  Inventory::ItemTransaction.where(facility: facility).delete_all

  # 2. Setup the nutrient catalogue
  #     - Nutrients
  #       - Blend
  #       - Potassium
  #         - Seaweed
  #       - Nitrogen
  #         - Blood Meal
  #         - Urea
  #     - Supplements
  #     - Grow Light
  #     
  #     Others
  #     Sales Product
  # 
  nutrient  = Inventory::Catalogue.create!( label: 'Nutrients',
                                            catalogue_type: 'raw_materials',
                                            category: '', 
                                            sub_category: '', 
                                            key: 'nutrients',
                                            facility: facility)

  potassium = Inventory::Catalogue.create!( label: 'Potassium Product', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: '', 
                                            key: 'potassium',
                                            facility: facility)

  seaweed   = Inventory::Catalogue.create!( label: 'Seaweed', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: 'potassium', 
                                            key: 'seaweed', 
                                            facility: facility)

  nitrogen  = Inventory::Catalogue.create!( label: 'Nitrogen Product', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: '', 
                                            key: 'nitrogen',
                                            facility: facility)

  blood_meal = Inventory::Catalogue.create!(label: 'Nitrogen Product', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: 'nitrogen', 
                                            key: 'blood_meal',
                                            facility: facility)

  urea      = Inventory::Catalogue.create!( label: 'Nitrogen Product', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: 'nitrogen', 
                                            key: 'urea',
                                            facility: facility)

  grow_lights = Inventory::Catalogue.create!( label: 'Grow Lights',
                                            catalogue_type: 'raw_materials',
                                            category: '', 
                                            sub_category: '', 
                                            key: 'grow_lights',
                                            facility: facility)

  eye_drops  = Inventory::Catalogue.create!(label: 'Eye drops',
                                            catalogue_type: 'raw_materials',
                                            category: '', 
                                            sub_category: '', 
                                            key: 'eye_drops',
                                            facility: facility)

  plant_catalogue  = Inventory::Catalogue.create!(label: 'Plant',
                                            catalogue_type: 'plant',
                                            category: '', 
                                            sub_category: '', 
                                            key: 'plant',
                                            facility: facility)

  # 3. Setup vendor
  vendor =    Inventory::Vendor.find_or_create_by(name: 'vendor #1', vendor_no: 'VendOne')

  # 4. Setup Purchase Order
  UOM =       Common::UnitOfMeasure

  # Setup bag UOM
  UOM.find_or_create_by(name: 'bag',
                        unit: 'bag', 
                        dimension: 'custom', 
                        is_base_unit: true, 
                        base_unit: 'bag',
                        conversion: 1)

  # Setup kg UOM
  UOM.find_or_create_by(name: 'kg',
                        unit: 'kg', 
                        dimension: 'weights', 
                        is_base_unit: true, 
                        base_unit: 'kg',
                        conversion: 1)

  po =    Inventory::PurchaseOrder.create!( purchase_order_no:  'PO001',
                                            purchase_order_date: 50.days.ago,
                                            vendor: vendor,
                                            facility: facility,
                                            status: 'approved')

  po.items.create!(                         catalogue: seaweed,
                                            quantity: 5,
                                            uom: UOM.custom('bag'),
                                            price: 5,
                                            currency: 'USD',
                                            tax: 0,
                                            product_name: 'xyz',
                                            manufacturer: 'xxx',
                                            description: 'i can be anything')
  po.save!
  
  # 5. Receive invoice for PO
  invoice = Inventory::VendorInvoice.create!( invoice_no: 'IV000010', 
                                            invoice_date: 10.days.ago, 
                                            facility: po.facility,
                                            purchase_order: po,
                                            vendor: po.vendor)

  invoice.items.create!(                    catalogue: po.items.first.catalogue,
                                            quantity: 25,
                                            uom: po.items.first.uom,
                                            price: 5, 
                                            tax: 0,
                                            manufacturer: po.items.first.manufacturer,
                                            product_name: po.items.first.product_name,
                                            description: 'i can be anything')

  po.update!(status: 'completed')

  # This is table of product sold by vendor. Not really needed.
  # Inventory::VendorProduct.find_or_create_by!(
  #   vendor:       vendor,
  #   catalogue:    seaweed,
  #   product_name: product_name,
  #   manufacturer:        item.manufacturer,
  #   order_uom:    UOM.units.find('bags'), # uom inside PO and stock receive
  #   conversion:   bag_to_kg,              # conversion rule, 1 bag = 65 kg
  #   uom:          material_uom)
  
  # 6. When taking stock intake, matching with Invoice
  invoice.items.each do |item|
    material_uom = UOM.weights('kg')
    bag_to_kg = 65  # conversion rule, 1 bag = 65 kg

    # Stock entry record with matching to invoice item
    Inventory::ItemTransaction.create!( ref_id:           item.id,
                                        ref_type:         'Inventory::VendorInvoiceItem',
                                        event_type:       'stock_intake',         # Move to Constants
                                        event_date:       Date.today,             # stock intake happen today
                                        facility:         invoice.facility,
                                        catalogue:        item.catalogue,
                                        product_name:     item.product_name,
                                        description:      item.description,
                                        manufacturer:     item.manufacturer,
                                        uom:              material_uom,
                                        quantity:         25 * bag_to_kg,
                                        order_quantity:   25,                   # quantity inside PO and stock receive
                                        order_uom:        item.uom,               # uom inside PO and stock receive
                                        conversion:       bag_to_kg,              # conversion rule, 1 bag = 65 kg
                                        facility_strain:  nil)
  end


  # 10. Alt - PO for plants
  facility_strain = Inventory::FacilityStrain.find_or_create_by(
    facility: facility,
    strain_name: 'Acme XYZ',
    strain_type: 'sativa',
    created_by: User.last)

  # Setup pot UOM
  UOM.find_or_create_by(
    name: 'Pot',
    unit: 'pot', 
    dimension: 'custom', 
    is_base_unit: true, 
    base_unit: 'pot',
    conversion: 1)

  plant_po = Inventory::PurchaseOrder.create!(  purchase_order_no:    'PO002', 
                                                purchase_order_date:  50.days.ago, 
                                                vendor:               vendor,        # should be "Deliver to"
                                                facility:             facility, 
                                                status:               'approved')

  plant_po.items.create!(                       catalogue:    plant_catalogue,
                                                quantity:     3,
                                                uom:          UOM.custom('pot'),
                                                price:        15.30,
                                                currency:     'USD',
                                                tax:          0,
                                                product_name:    facility_strain.strain_name + ' Mother plant',
                                                facility_strain: facility_strain,
                                                manufacturer: '',
                                                description:  '')

  # 11. Alt - Invoice for Plant PO
  plant_invoice = Inventory::VendorInvoice.create!(
                                                invoice_no:     'VF-IV-20180003', 
                                                invoice_date:   3.days.ago, 
                                                facility:       po.facility,
                                                purchase_order: plant_po,
                                                vendor:         vendor)

  plant_invoice.items.create!(                  facility_strain_id: plant_po.items.first.facility_strain_id,
                                                catalogue:    plant_po.items.first.catalogue,
                                                quantity:     25,
                                                uom:          plant_po.items.first.uom,
                                                price:        13.5, 
                                                tax:          0,
                                                manufacturer: plant_po.items.first.manufacturer,
                                                product_name: plant_po.items.first.product_name,
                                                description: 'i can be anything')
  plant_po.update!(status: 'completed')
end
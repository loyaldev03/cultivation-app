desc "Create data from new facility to PO, invoice, stock receive, task planning and material use"
task seed_until_po: :environment  do

  # 1. Setup facility & master data
  facility = Facility.find_or_create_by!(name: 'Facility 1', code: 'F1') do |f|
    f.is_complete = true
  end

  if facility.rooms.empty?
    facility.rooms.create!(name: 'r1', code: 'r1', purpose: 'clone', is_complete: true)
  end

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
                        dimension: 'weight', 
                        is_base_unit: true, 
                        base_unit: 'kg',
                        conversion: 1)

  facility_strain = Inventory::FacilityStrain.find_or_create_by(
                        facility:     facility,
                        strain_name:  'Acme XYZ',
                        strain_type:  'sativa',
                        created_by:   User.last)

  # 1.1. Reset data
  Inventory::Catalogue.delete_all
  Inventory::PurchaseOrder.where(facility: facility).delete_all
  Inventory::VendorInvoice.where(facility: facility).delete_all
  Inventory::ItemTransaction.where(facility: facility).delete_all

  batch_ids = Cultivation::Batch.where(facility_id: facility.id, facility_strain: facility_strain).pluck(:id)
  Cultivation::Task.where(:batch.in => batch_ids).delete_all
  Cultivation::Batch.where(:id.in => batch_ids).delete_all

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
                                            uom_dimension: 'weight')

  potassium = Inventory::Catalogue.create!( label: 'Potassium Product', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: '', 
                                            key: 'potassium',
                                            uom_dimension: 'weight')

  seaweed   = Inventory::Catalogue.create!( label: 'Seaweed', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: 'potassium', 
                                            key: 'seaweed', 
                                            uom_dimension: 'weight')

  nitrogen  = Inventory::Catalogue.create!( label: 'Nitrogen Product', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: '', 
                                            key: 'nitrogen',
                                            uom_dimension: 'weight')

  blood_meal = Inventory::Catalogue.create!(label: 'Nitrogen Product', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: 'nitrogen', 
                                            key: 'blood_meal',
                                            uom_dimension: 'weight')

  urea      = Inventory::Catalogue.create!( label: 'Nitrogen Product', 
                                            catalogue_type: 'raw_materials',
                                            category: 'nutrients', 
                                            sub_category: 'nitrogen', 
                                            key: 'urea',
                                            uom_dimension: 'weight')

  grow_lights = Inventory::Catalogue.create!( label: 'Grow Lights',
                                            catalogue_type: 'raw_materials',
                                            category: '', 
                                            sub_category: '', 
                                            key: 'grow_lights',
                                            uom_dimension: 'weight')

  eye_drops  = Inventory::Catalogue.create!(label: 'Eye drops',
                                            catalogue_type: 'raw_materials',
                                            category: '', 
                                            sub_category: '', 
                                            key: 'eye_drops',
                                            uom_dimension: 'weight')

  _desk      = Inventory::Catalogue.create!(label: 'Desk',
                                            catalogue_type: 'non_sales_product',
                                            category: '',
                                            sub_category: '',
                                            key: 'desk',
                                            uom_dimension: 'pc')

  # For seed and clone and plants
  plant_catalogue  = Inventory::Catalogue.create!(label: 'Plant',
                                            catalogue_type: 'plant',
                                            category: '', 
                                            sub_category: '', 
                                            key: 'plant',
                                            uom_dimension: 'pieces')

  # 3. Setup vendor
  vendor =    Inventory::Vendor.find_or_create_by(name: 'vendor #1', vendor_no: 'VendOne')

  # 4. Setup Purchase Order
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
                                            terms_in_days: po.vendor.default_terms.to_i,
                                            vendor: po.vendor)

  invoice.items.create!(                    catalogue: po.items.first.catalogue,
                                            quantity: 25,
                                            uom: po.items.first.uom,
                                            price: 5, 
                                            tax: 0,
                                            manufacturer: po.items.first.manufacturer,
                                            product_name: po.items.first.product_name,
                                            description: 'i can be anything')

  invoice.update!(status: 'received') # to be decided
  po.update!(status: 'completed')

  # This is table of product sold by vendor. Not needed at the moment.
  # Inventory::VendorProduct.find_or_create_by!(
  #   vendor:       vendor,
  #   catalogue:    seaweed,
  #   product_name: product_name,
  #   manufacturer:        item.manufacturer,
  #   order_uom:    UOM.units.find('bags'), # uom inside PO and stock receive
  #   conversion:   bag_to_kg,              # conversion rule, 1 bag = 65 kg
  #   uom:          material_uom)
  
  # 6. When taking stock intake, match items with Invoice

  invoice.items.each do |item|
    material_uom = 'kg'
    bag_to_kg = 65  # conversion rule, 1 bag = 65 kg

    # Stock entry record with matching to invoice item
    Inventory::ItemTransaction.create!( ref_id:           item.id,
                                        ref_type:         'Inventory::VendorInvoiceItem',
                                        event_type:       'stock_intake',         # Move to Constants
                                        event_date:       Time.current,           # stock intake happen today
                                        facility:         invoice.facility,
                                        catalogue:        item.catalogue,
                                        product_name:     item.product_name,
                                        description:      item.description,
                                        manufacturer:     item.manufacturer,
                                        uom:              'kg',
                                        quantity:         25 * bag_to_kg,
                                        order_quantity:   25,                   # quantity inside PO and stock receive
                                        order_uom:        item.uom,               # uom inside PO and stock receive
                                        conversion:       bag_to_kg,              # conversion rule, 1 bag = 65 kg
                                        location_id:      invoice.facility.rooms.first.id,
                                        facility_strain:  nil)
  end


  # 10. TODO PO for buying clones


  # Setup pot UOM
  UOM.find_or_create_by(name:         'Pot',
                        unit:         'pot', 
                        dimension:    'plants', 
                        is_base_unit: true, 
                        base_unit:    'pot',
                        conversion:   1)

  plant_po = Inventory::PurchaseOrder.create!(  purchase_order_no:    'PO002', 
                                                purchase_order_date:  50.days.ago, 
                                                vendor:               vendor,        # should be "Deliver to"
                                                facility:             facility, 
                                                status:               'approved')

  plant_po.items.create!(                       catalogue:    plant_catalogue,
                                                quantity:     3,
                                                uom:          'pot',
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



  # 1. Task planning
  batch = Cultivation::Batch.create!(
    batch_no: 'b111',
    name: 'batch1',
    start_date: Time.current + 2.days, # future date
    batch_source: 'clones_from_mother',
    facility_id: facility_strain.facility_id,
    current_growth_stage: 'clone',
    facility_strain: facility_strain
  )

  start_date = Time.current + 2.days
  [
    {
      phase: Constants::CONST_CLONE,
      name: 'Clone',
      duration: 17,
      estimated_hours: nil,
      materials: nil,
      indent: 0
    },
    {
      phase: Constants::CONST_CLONE,
      name: 'Prepare',
      duration: 1,
      estimated_hours: nil,
      materials: nil,
      indent: 1
    },
    {
      phase: Constants::CONST_CLONE,
      name: 'Prepare Sample',
      duration: 1,
      estimated_hours: nil,
      materials: nil,
      indent: 1
    }
  ].each do |tp|
    # puts "task, tp: #{tp}"
    duration = tp[:duration].nil? ? 1 : tp[:duration].to_i
    prev_task = batch.tasks.count > 0 ? batch.tasks[-1].id : nil

    batch.tasks.create!(phase:            tp[:phase],
                        name:             tp[:name],
                        duration:         duration,
                        start_date:       start_date,
                        end_date:         start_date + duration.days,
                        estimated_hours:  tp[:estimated_hours],
                        indent:           tp[:indent])
  end

  batch.tasks.last.material_use.create!(
                          uom: seaweed.uoms.first, 
                          catalogue: seaweed,
                          quantity: 5.5)

  # 2. Daily consumption log
  wd = batch.tasks.last.work_days.create!(
                          date: Date.today,
                          user_id: User.last.id) 

  # user has used 0.002 kg
  mat_used = wd.materials_used.create!(
                          quantity: 0.002,
                          uom: seaweed.uoms.first, 
                          catalogue: seaweed)

  # Drawdown qty in inventory
  Inventory::ItemTransaction.create!( 
                          ref_id:           mat_used.id,
                          ref_type:         mat_used.class.name,
                          event_type:       'materials_used',         # Move to Constants
                          event_date:       Time.current,             # stock intake happen today
                          facility:         Facility.find(batch.facility_id),
                          catalogue:        seaweed,
                          product_name:     seaweed.label,
                          description:      '',
                          manufacturer:     '',
                          uom:              seaweed.uoms.first, 
                          quantity:         -0.002)
end

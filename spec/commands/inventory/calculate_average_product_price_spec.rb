require "rails_helper"

RSpec.describe Inventory::CalculateAverageProductPrice, type: :command do
  let (:facility) do
    facility = create(:facility, :is_complete)
    facility.rooms << build(:room, :storage, :is_complete)
    facility.save!
    facility
  end
  
  let (:manager) { create(:user, :manager, facilities: [facility.id]) }

  let (:catalogue) { Inventory::Catalogue.create!(key: Constants::NUTRIENTS_KEY) }

  let (:uom_kg) { create(:unit_of_measure, :kg) }
  let (:uom_pc) { create(:unit_of_measure, :pc) }
  let (:uom_bag) { create(:unit_of_measure, :bag) }

  # {"data":
  #   {
  #     "id":"5cfcf102edfdb2075b342b50",
  #     "type":"raw_material",
  #     "attributes":{
  #       "order_quantity":2, <-- how many set that was bought
  #       "order_uom":"pc",   <-- how many set that was bought
  #       "quantity":24,      
  #       "uom":"kg",
  #       "manufacturer":"asd",
  #       "description":"asdsd",
  #       "conversion":12,
  #       "product_name":"Product1b",
  #       "product_id":"5cf92cf5edfdb20b3b46aaab",
  #       "product":{
  #         "id":"5cf92cf5edfdb20b3b46aaab",
  #         "name":"Product1b",
  #         "sku":null,
  #         "status":null,
  #         "transaction_limit":0,
  #         "description":"asdsd",
  #         "manufacturer":"asd",
  #         "upc":"",
  #         "nitrogen":1,
  #         "prosphorus":1,
  #         "potassium":1,
  #         "nutrients":[{"element":"boron","value":2}],
  #         "size":2,             
  #         "ppm":1,
  #         "common_uom":"pc",    <--- change to product.order_uom. common_uom is 
  #         "epa_number":"",
  #         "attachments":[],
  #         "catalogue_id":"5c067b01edfdb2c656d60dbf"
  #       },
  #       "facility_id":"5bea7e7eedfdb2c4e1436110",
  #       "facility_name":"Acme Comp",
  #       "catalogue_id":"5c067b01edfdb2c656d60dbf",
  #       "catalogue":"Nutrients",
  #       "location_id":"5bed2e6fedfdb2040c362cba",
  #       "vendor":{
  #         "id":"5bea8038edfdb2c4e1436154",
  #         "name":"V1 Name",
  #         "vendor_no":"V1",
  #         "address":"add3",
  #         "state_license_num":"asda",
  #         "state_license_expiration_date":"2018-10-29T09:00:00.000-07:00",
  #         "location_license_expiration_date":"2018-10-29T09:00:00.000-07:00",
  #         "location_license_num":"ads"
  #       },
  #       "purchase_order":{
  #         "id":"5bea8038edfdb2c4e1436155",
  #         "purchase_order_no":"PO V1a",
  #         "purchase_order_date":"2018-11-06T08:00:00.000-08:00"
  #       },
  #       "vendor_invoice":{
  #         "id":"5bea8038edfdb2c4e1436157",
  #         "invoice_no":"PO V1b",
  #         "invoice_date":"2018-11-06T08:00:00.000-08:00",
  #         "item_price":15,
  #         "item_currency":"USD"
  #       }
  #     }}
  #   }

  context ".call" do
    it 'should calculate average correctly' do
      Rails.logger.error "catalogue: #{catalogue.id}"
      args = {
        facility_id: facility.id,
        location_id: facility.rooms.last.id,
        catalogue: catalogue.id,
        product_name: 'product one',
        manufacturer: 'product maker',
        product_uom: 'pc',
        product_size: 1,
        quantity: 5,
        uom: 'kg',
        order_quantity: 5,
        order_uom: uom_bag.unit,
        price: 5.6,
        qty_per_package: 2,
        vendor_name: 'vendor one',
        purchase_order_no: 'po1',
        invoice_no: 'iv 1',
        purchase_date: Time.now
      }
      cmd = Inventory::SetupRawMaterial.call(manager, args)
      expect(cmd.success?).to eq true

      Rails.logger.error "cmd result: #{cmd.result.inspect}"
    end
  end
end

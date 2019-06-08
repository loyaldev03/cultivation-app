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

  context ".call" do
    it 'should calculate average correctly' do
      Rails.logger.error "catalogue: #{catalogue.id}"
      args = {
        facility_id: facility.id,
        location_id: facility.rooms.last.id,
        catalogue: catalogue.id,
        product_name: 'product one',
        manufacturer: 'product maker',
        product_uom: uom_pc.unit,
        product_size: 1,
        quantity: 5,
        uom: uom.unit,
        order_quantity: 5,
        order_uom: uom_bag.unit,
        price: 5.6,
        qty_per_package: 1,
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

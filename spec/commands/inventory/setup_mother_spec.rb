require 'rails_helper'

RSpec.describe Inventory::SetupMother, type: :command do
  context ".call" do
    let!(:facility) do
      facility = create(:facility, :is_complete)
      facility.rooms.each do |room|
        room.rows.each do |row|
          row.shelves.each do |shelf|
            shelf.trays.each(&:save!)
          end
        end
      end
      facility
    end
    let(:facility_strain) { create(:facility_strain, facility: facility) }
    let(:mother_room) { facility.rooms.detect { |r| r.purpose == "mother" } }
    let(:mother_location) { mother_room.rows.first.shelves.first.trays.first }
    let(:user) { create(:user) }
    let(:planted_on) { Time.current }
    let(:new_vendor_name) { 'new_vendor_name'}
    let(:vendor_no) { 'vendor_no'}
    let(:address) { 'address'}
    let(:vendor_state_license_num) { 'vendor_state_license_num'}
    let(:vendor_state_license_expiration_date) { (Date.today + 15.day).iso8601 }
    let(:vendor_location_license_expiration_date) { (Date.today + 15.day).iso8601 }
    let(:vendor_location_license_num) { 'vendor_location_license_num'}
    let(:vendor_type) { 'plant_supplier' }
    let(:single_plant_id) { 'a1'}
    let(:plant_ids) { 'a1, a2'}
    let(:existing_strain) { Common::Strain.create!(name: 'xyz-existing', strain_type: 'indica') }
    let(:existing_batch) { nil }
    let(:invoice_no) { 'invoice_no_1' }
    let(:purchase_order_no) { 'purchase_order_no_1' }
    let(:invoice_date) { (Date.today - 15.day).iso8601 }

    it "should create mother for a new strain & location" do
      vendor_count_before = Inventory::Vendor.count
      invoice_count_before = Inventory::VendorInvoice.count
      plant_count_before = Inventory::Plant.count

      cmd = Inventory::SetupMother.call(
        user,
        {
          plant_ids: single_plant_id,
          facility_strain_id: facility_strain.id.to_s,
          location_id: mother_location.id.to_s,
          planted_on: planted_on,
          vendor_name: new_vendor_name,
          vendor_no: vendor_no,
          address: address,
          vendor_state_license_num: vendor_state_license_num,
          vendor_state_license_expiration_date: vendor_state_license_expiration_date,
          vendor_location_license_expiration_date: vendor_location_license_expiration_date,
          vendor_location_license_num: vendor_location_license_num,
          invoice_no: invoice_no,
          purchase_order_no: purchase_order_no,
          invoice_date: invoice_date
        })
      
      expect(cmd.errors.to_h).to eq({})
      expect(cmd.success?).to be true
      expect(cmd.result.count).to eq 1

      # Check db count increased
      expect(Inventory::Vendor.all.count).to eq (vendor_count_before + 1)
      # TODO: To refactor
      # expect(Inventory::VendorInvoice.all.count).to eq (invoice_count_before + 1)
      expect(Inventory::Plant.all.count).to eq (plant_count_before + 1)
      
      # Check attribute created correctly
      expect(cmd.result[0]).to have_attributes(
        facility_strain: facility_strain,
        plant_id: single_plant_id,
        location_id: mother_location.id,
        status: 'available',
        current_growth_stage: 'mother',
        planting_date: planted_on
      )
    end

    
    it "should create multiple mothers for a existing strain" do
      vendor_count_before = Inventory::Vendor.count
      invoice_count_before = Inventory::VendorInvoice.count
      plant_count_before = Inventory::Plant.count

      cmd = Inventory::SetupMother.call(
        user,
        {
          plant_ids: plant_ids,
          facility_strain_id: facility_strain.id.to_s,
          location_id: mother_location.id.to_s,
          planted_on: planted_on,
          vendor_name: new_vendor_name,
          vendor_no: vendor_no,
          address: address,
          vendor_state_license_num: vendor_state_license_num,
          vendor_state_license_expiration_date: vendor_state_license_expiration_date,
          vendor_location_license_expiration_date: vendor_location_license_expiration_date,
          vendor_location_license_num: vendor_location_license_num,
          invoice_no: invoice_no,
          purchase_order_no: purchase_order_no,
          invoice_date: invoice_date
        })
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.count).to eq 2

      # Check db count increased
      # TODO: To refactor
      expect(Inventory::Vendor.all.count).to eq (vendor_count_before + 1)
      expect(Inventory::VendorInvoice.all.count).to eq (invoice_count_before + 1)
      expect(Inventory::Plant.all.count).to eq (plant_count_before + 2)
      
      # Check attribute created correctly
      expect(cmd.result[1]).to have_attributes(
        plant_id: plant_ids.split(',').last.strip,
        facility_strain: facility_strain,
        location_id: mother_location.id,
        status: 'available',
        current_growth_stage: 'mother',
        planting_date: planted_on
      )
    end

    it "should create mother for a existing vendor"

    it "should create mother for a existing batch & strain"

    it "should save mother for later"
  end
end

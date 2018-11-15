require 'rails_helper'

RSpec.describe Inventory::SetupMother, type: :command do
  context ".call" do
    let(:facility) { Facility.create!(name: Faker::Lorem.word, code: Faker::Lorem.word) }
    let(:facility_strain) { Inventory::FacilityStrain.create!(facility: facility, strain_name: 'X1', strain_type: 'sativa', created_by: user) }
    let(:room) { facility.rooms.create!(name: 'room 1', code: 'r1') }
    let(:user) { create(:user) }
    let(:planted_on) { DateTime.now.iso8601 }
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
          location_id: room.id.to_s,
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
        location_id: room.id,
        location_type: 'room',
        status: 'available',
        current_growth_stage: 'mother',
        planting_date: DateTime.parse(planted_on)
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
          location_id: room.id.to_s,
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
        location_id: room.id,
        location_type: 'room',
        status: 'available',
        current_growth_stage: 'mother',
        planting_date: DateTime.parse(planted_on)
      )
    end

    it "should create mother for a existing vendor"

    it "should create mother for a existing batch & strain"

    it "should save mother for later"
  end
end

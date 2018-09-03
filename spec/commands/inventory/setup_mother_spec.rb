require 'rails_helper'

RSpec.describe Inventory::SetupMother, type: :command do
  context ".call" do
    let(:facility) { Facility.create!(name: Faker::Lorem.word, code: Faker::Lorem.word) }
    let(:room) { facility.rooms.create!(name: 'room 1', code: 'r1') }
    let(:user) { nil }
    let(:strain) { 'xyz'}
    let(:strain_type) { 'sativa'}
    let(:planted_on) { DateTime.now.iso8601 }
    let(:new_vendor_name) { 'new_vendor_name'}
    let(:vendor_no) { 'vendor_no'}
    let(:address) { 'address'}
    let(:vendor_state_license_num) { 'vendor_state_license_num'}
    let(:vendor_state_license_expiration_date) { (Date.today + 15.day).iso8601 }
    let(:vendor_location_license_expiration_date) { (Date.today + 15.day).iso8601 }
    let(:vendor_location_license_num) { 'vendor_location_license_num'}
    let(:vendor_type) { 'plant_supplier' }
    let(:single_plant_ids) { 'a1'}
    let(:plant_ids) { 'a1, a2'}

    let(:existing_strain) { Common::Strain.create!(name: 'xyz-existing', strain_type: 'indica') }
    let(:existing_batch) { nil }

    it "should create mother for a new strain & location" do
      vendor_count_before = Inventory::Vendor.count
      invoice_count_before = Inventory::VendorInvoice.count
      item_count_before = Inventory::Item.count
      item_article_count_before = Inventory::ItemArticle.count

      cmd = Inventory::SetupMother.call(
        user,
        {
          plant_ids: single_plant_ids,
          strain: strain,
          strain_type: strain_type,
          room_id: room.id.to_s,
          planted_on: planted_on,
          vendor_name: new_vendor_name,
          vendor_no: vendor_no,
          address: address,
          vendor_state_license_num: vendor_state_license_num,
          vendor_state_license_expiration_date: vendor_state_license_expiration_date,
          vendor_location_license_expiration_date: vendor_location_license_expiration_date,
          vendor_location_license_num: vendor_location_license_num,
          vendor_type: vendor_type
        })
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.count).to eq 1

      # Check db count increased
      expect(Inventory::Vendor.all.count).to eq (vendor_count_before + 1)
      expect(Inventory::VendorInvoice.all.count).to eq (invoice_count_before + 1)
      expect(Inventory::Item.all.count).to eq (item_count_before + 1)
      expect(Inventory::ItemArticle.all.count).to eq (item_article_count_before + 1)
      
      # Check attribute created correctly
      expect(cmd.result[0]).to have_attributes(
        item: Inventory::Item.all.last,
        facility: facility,
        strain: Common::Strain.find_by(name: strain),
        serial_no: 'a1',
        location_id: room.id,
        location_type: 'room',
        status: 'available',
        plant_status: 'mother',
        planted_on: DateTime.parse(planted_on)
      )
    end

    
    it "should create multiple mothers for a existing strain" do
      vendor_count_before = Inventory::Vendor.count
      invoice_count_before = Inventory::VendorInvoice.count
      item_count_before = Inventory::Item.count
      item_article_count_before = Inventory::ItemArticle.count

      cmd = Inventory::SetupMother.call(
        user,
        {
          plant_ids: plant_ids,
          strain: existing_strain.name,
          strain_type: existing_strain.strain_type,
          room_id: room.id.to_s,
          planted_on: planted_on,
          vendor_name: new_vendor_name,
          vendor_no: vendor_no,
          address: address,
          vendor_state_license_num: vendor_state_license_num,
          vendor_state_license_expiration_date: vendor_state_license_expiration_date,
          vendor_location_license_expiration_date: vendor_location_license_expiration_date,
          vendor_location_license_num: vendor_location_license_num,
          vendor_type: vendor_type
        })
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.count).to eq 2

      # Check db count increased
      expect(Inventory::Vendor.all.count).to eq (vendor_count_before + 1)
      expect(Inventory::VendorInvoice.all.count).to eq (invoice_count_before + 1)
      expect(Inventory::Item.all.count).to eq (item_count_before + 1)
      expect(Inventory::ItemArticle.all.count).to eq (item_article_count_before + 2)
      
      # Check attribute created correctly
      expect(cmd.result[0]).to have_attributes(
        item: Inventory::Item.all.last,
        facility: facility,
        strain: existing_strain,
        serial_no: 'a1',
        location_id: room.id,
        location_type: 'room',
        status: 'available',
        plant_status: 'mother',
        planted_on: DateTime.parse(planted_on)
      )

      expect(cmd.result[1]).to have_attributes(
        item: Inventory::Item.all.last,
        facility: facility,
        strain: existing_strain,
        serial_no: 'a2',
        location_id: room.id,
        location_type: 'room',
        status: 'available',
        plant_status: 'mother',
        planted_on: DateTime.parse(planted_on)
      )
    end

    it "should create mother for a existing vendor"

    it "should create mother for a existing batch & strain"
  end
end
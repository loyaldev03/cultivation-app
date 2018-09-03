require 'rails_helper'

RSpec.describe Inventory::CreatePlants, type: :command do
  context ".call" do
    let(:strain) { Common::Strain.create!(name: 'xyz', strain_type: 'indica') }
    let(:facility) { Facility.create!(name: Faker::Lorem.word, code: Faker::Lorem.word) }
    let(:room) { facility.rooms.create!(name: 'room 1', code: 'r1') }
    let(:planted_on) { Date.today.to_datetime }

    it "should create mother for a given strain & location" do
      cmd = Inventory::CreatePlants.call(
        plant_ids: %w(a1 a2 a3 a4),
        strain_name: strain.name,
        location_id: room.id.to_s,
        location_type: 'room',
        status: 'available',
        planted_on: planted_on,
        plant_status: 'mother'
      )
      
      item  = Inventory::Item.find_by(
        name: strain.name, 
        item_type: 'plant',
        facility: facility
      )

      expect(item.present?).to be true
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.count).to eq 4
      expect(cmd.result.all? {|x| x.persisted? }).to be true

      expect(cmd.result[0]).to have_attributes(
        item: item,
        facility: facility,
        strain: strain,
        serial_no: 'a1',
        location_id: room.id,
        status: 'available',
        plant_status: 'mother',
        planted_on: planted_on
      )

      expect(cmd.result[1]).to have_attributes(
        item: item,
        facility: facility,
        strain: strain,
        serial_no: 'a2',
        location_id: room.id,
        status: 'available',
        plant_status: 'mother',
        planted_on: planted_on
      )

      expect(cmd.result[2]).to have_attributes(
        item: item,
        facility: facility,
        strain: strain,
        serial_no: 'a3',
        location_id: room.id,
        status: 'available',
        plant_status: 'mother',
        planted_on: planted_on
      )

      expect(cmd.result[3]).to have_attributes(
        item: item,
        facility: facility,
        strain: strain,
        serial_no: 'a4',
        location_id: room.id,
        status: 'available',
        plant_status: 'mother',
        planted_on: planted_on
      )
    end
  end
end

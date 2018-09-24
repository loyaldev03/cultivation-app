require 'rails_helper'

RSpec.describe Inventory::SaveFacilityStrain, type: :command do
  context ".call" do
    let(:valid_user) { User.create!(email: 'email@email.com', password: 'password', password_confirmation: 'password') }
    let(:facility) { Facility.create!(name: Faker::Lorem.word, code: Faker::Lorem.word) }
    let(:existing_fs) { create(:facility_strain) }
    
    it "should create strain for facility" do
      command = Inventory::SaveFacilityStrain.call(
        valid_user,
        facility_id: facility.id,
        strain_name: 'OG Kush',
        strain_type: 'sativa',
        sativa_makeup: '20',
        indica_makeup: '80',
        testing_status: 'external',
        thc: '10',
        cbd: '40.5'
      )

      expect(command.errors).to be {}
      expect(command.success?).to be true
      expect(command.result.present?).to be true
     
      facility_strain = Inventory::FacilityStrain.find(command.result.id)
      expect(facility_strain.created_by).to eq valid_user
      expect(facility_strain.facility).to eq facility
      expect(facility_strain.strain_name).to eq 'OG Kush'
      expect(facility_strain.strain_type).to eq 'sativa'
      expect(facility_strain.sativa_makeup).to eq 20
      expect(facility_strain.indica_makeup).to eq 80
      expect(facility_strain.testing_status).to eq 'external'
      expect(facility_strain.thc).to eq 10
      expect(facility_strain.cbd).to eq 40.5
    end


    it "should update strain for facility" do
      command = Inventory::SaveFacilityStrain.call(
        valid_user,
        facility_strain_id: existing_fs.id.to_s,
        strain_name: 'xxx',
        strain_type: 'indica',
        sativa_makeup: '77',
        indica_makeup: '23',
        testing_status: 'external',
        thc: '2',
        cbd: '3'
      )

      expect(command.errors).to be {}
      expect(command.success?).to be true
      expect(command.result.present?).to be true

      facility_strain = Inventory::FacilityStrain.find(command.result.id)
      expect(facility_strain.created_by).to eq existing_fs.created_by
      expect(facility_strain.facility).to eq existing_fs.facility
      expect(facility_strain.strain_name).to eq 'xxx'
      expect(facility_strain.strain_type).to eq 'indica'
      expect(facility_strain.sativa_makeup).to eq 77
      expect(facility_strain.indica_makeup).to eq 23
      expect(facility_strain.testing_status).to eq 'external'
      expect(facility_strain.thc).to eq 2
      expect(facility_strain.cbd).to eq 3
    end
  end
end
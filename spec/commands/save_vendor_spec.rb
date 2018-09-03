require 'rails_helper'

SaveVendor = Inventory::SaveVendor
Vendor = Inventory::Vendor

RSpec.describe Inventory::SaveVendor, type: :command do
  context 'when params has no id' do
    subject {
      {
        name: Faker::Lorem.word
      }
    }

    it 'save as new record' do
      before_count = Inventory::Vendor.count
      Inventory::SaveVendor.call(name: Faker::Lorem.word)
      Inventory::SaveVendor.call(name: Faker::Lorem.word)

      expect(Inventory::Vendor.count).to eq (before_count + 2)
    end
    
    it 'save all attributes' do
      cmd = Inventory::SaveVendor.call(name: subject[:name])

      saved = Inventory::Vendor.find_by(id: cmd.result.id)
      expect(cmd.errors).to be { }
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        name: subject[:name],
      )
    end
  end

  context 'when params contain :id' do
    subject { Inventory::Vendor.create!(name: Faker::Lorem.word )}

    it 'does not create new record' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
      }

      Inventory::SaveVendor.call(params)
      cmd = SaveVendor.call(params)

      expect(Inventory::Vendor.count).to eq 1
      expect(cmd.errors).to be { }
    end

    it 'does not delete timestamp attributes' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
      }

      Inventory::SaveVendor.call(params)

      saved = Inventory::Vendor.find(params[:id])
      expect([saved.c_at.nil?, saved.u_at.nil?]).to eq [false, false]
    end

    it 'update existing record attributes' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
      }

      SaveVendor.call(params)
      saved = Inventory::Vendor.find(params[:id])
      expect(saved).to have_attributes(
        name: params[:name],
      )
    end

    it 'update existing record attributes (multiple calls)' do
      params1 = {id: subject.id.to_s, desc: Faker::Lorem.sentence}
      params2 = {id: subject.id.to_s, desc: Faker::Lorem.sentence}

      SaveVendor.call(params1)
      SaveVendor.call(params2)

      saved = Inventory::Vendor.find(subject.id.to_s)
      expect(saved).to have_attributes(
        name: subject.name,
      )
    end
  end
end

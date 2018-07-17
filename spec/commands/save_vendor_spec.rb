require 'rails_helper'

RSpec.describe SaveVendor, type: :command do
  context 'when params has no id' do
    subject {
      {
        name: Faker::Lorem.word
      }
    }

    it 'save as new record' do
      SaveVendor.call({name: Faker::Lorem.word})
      SaveVendor.call({name: Faker::Lorem.word})

      expect(Vendor.count).to eq 2
    end
    
    it 'save all attributes' do
      cmd = SaveVendor.call(name: subject[:name])

      saved = Vendor.find_by(id: cmd.result.id)
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
    subject {
      Vendor.create!(
        name: Faker::Lorem.word,
      )
    }

    it 'does not create new record' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
      }

      SaveVendor.call(params)
      cmd = SaveVendor.call(params)

      expect(Vendor.count).to eq 1
      expect(cmd.errors).to be { }
    end

    it 'does not delete timestamp attributes' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
      }

      SaveVendor.call(params)

      saved = Vendor.find(params[:id])
      expect([saved.c_at.nil?, saved.u_at.nil?]).to eq [false, false]
    end

    it 'update existing record attributes' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
      }

      SaveVendor.call(params)

      saved = Vendor.find(params[:id])
      expect(saved).to have_attributes(
        name: params[:name],
      )
    end

    it 'update existing record attributes (multiple calls)' do
      params1 = {id: subject.id.to_s, desc: Faker::Lorem.sentence}
      params2 = {id: subject.id.to_s, desc: Faker::Lorem.sentence}

      SaveVendor.call(params1)
      SaveVendor.call(params2)

      saved = Vendor.find(subject.id.to_s)
      expect(saved).to have_attributes(
        name: subject.name,
      )
    end
  end
end

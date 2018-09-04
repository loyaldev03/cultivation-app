require 'rails_helper'

RSpec.describe SaveStrain, type: :command do
  context 'when params has no id' do
    subject(:params) {
      {
        name: Faker::Lorem.word,
        desc: Faker::Lorem.sentence,
      }
    }

    it 'save as new record' do
      SaveStrain.call(params)
      SaveStrain.call(params)

      expect(Strain.count).to eq 2
    end

    it 'save all attributes' do
      cmd = SaveStrain.call(params)

      saved = Strain.find_by(id: cmd.result.id)
      expect(cmd.errors).to be { }
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        name: params[:name],
        desc: params[:desc],
      )
    end
  end

  context 'when params contain :id' do
    subject {
      Strain.create!(
        name: Faker::Lorem.word,
        desc: Faker::Lorem.sentence,
      )
    }

    before do
    end

    it 'does not create new record' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
        desc: Faker::Lorem.sentence,
      }

      SaveStrain.call(params)
      cmd = SaveStrain.call(params)

      expect(Strain.count).to eq 1
      expect(cmd.errors).to be { }
    end

    it 'does not delete timestamp attributes' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
        desc: Faker::Lorem.sentence,
      }

      SaveStrain.call(params)

      saved = Strain.find(params[:id])
      expect([saved.c_at.nil?, saved.u_at.nil?]).to eq [false, false]
    end

    it 'update existing record attributes' do
      params = {
        id: subject.id.to_s,
        name: Faker::Lorem.word,
        desc: Faker::Lorem.sentence,
      }

      SaveStrain.call(params)

      saved = Strain.find(params[:id])
      expect(saved).to have_attributes(
        name: params[:name],
        desc: params[:desc],
      )
    end

    it 'update existing record attributes (multiple calls)' do
      params1 = {id: subject.id.to_s, code: Faker::Number.number(3)}
      params2 = {id: subject.id.to_s, desc: Faker::Lorem.sentence}

      SaveStrain.call(params1)
      SaveStrain.call(params2)

      saved = Strain.find(subject.id.to_s)
      expect(saved).to have_attributes(
        name: subject.name,
        desc: params2[:desc],
      )
    end
  end
end

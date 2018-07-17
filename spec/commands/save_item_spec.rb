require 'rails_helper'

RSpec.describe SaveItem, type: :command do
  context "when params has no id" do
    subject(:params) {
      {
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence
      }
    }

    it "save as new record" do
      SaveItem.call(params)
      SaveItem.call(params)

      expect(Item.count).to eq 2
    end

    it "save all attributes" do
      cmd = SaveItem.call(params)

      saved = Item.find_by(id: cmd.result.id)
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        name: params[:name],
        code: params[:code],
        desc: params[:desc]
      )
    end
  end

  context "when params contain :id" do
    subject(:item) {
      Item.new(
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence
      )
    }

    before do
      item.save!
    end

    it "does not create new record" do
      params = {
        id: item.id.to_s,
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence
      }

      SaveItem.call(params)
      cmd = SaveItem.call(params)

      expect(Item.count).to eq 1
      expect(cmd.errors).to be {}
    end

    it "does not delete timestamp attributes" do
      params = {
        id: item.id.to_s,
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence
      }

      SaveItem.call(params)

      saved = Item.find(params[:id])
      expect([saved.c_at.nil?, saved.u_at.nil?]).to eq [false, false]
    end

    it "update existing record attributes" do
      params = {
        id: item.id.to_s,
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence
      }

      SaveItem.call(params)

      saved = Item.find(params[:id])
      expect(saved).to have_attributes(
        name: params[:name],
        code: params[:code],
        desc: params[:desc]
      )
    end

    it "update existing record attributes (multiple calls)" do
      params1 = { id: item.id.to_s, code: Faker::Number.number(3) }
      params2 = { id: item.id.to_s, desc: Faker::Lorem.sentence }

      SaveItem.call(params1)
      SaveItem.call(params2)

      saved = Item.find(item.id.to_s)
      expect(saved).to have_attributes(
        name: item.name,
        code: params1[:code],
        desc: params2[:desc]
      )
    end
  end
end

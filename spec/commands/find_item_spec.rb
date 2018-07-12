require 'rails_helper'

RSpec.describe FindItem, type: :command do
  context "given item args" do
    before do
      @item = Item.new(
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence
      )
      @item.save!
    end

    it "should return record when id exists" do
      cmd = FindItem.call({id: @item.id.to_s})

      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: @item.id,
        name: @item.name,
        code: @item.code,
        desc: @item.desc
      )
    end

    it "should return record when name exists" do
      cmd = FindItem.call({name: @item.name})

      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: @item.id,
        name: @item.name,
        code: @item.code,
        desc: @item.desc
      )
    end

    it "should return record when code exists" do
      cmd = FindItem.call({code: @item.code})

      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: @item.id,
        name: @item.name,
        code: @item.code,
        desc: @item.desc
      )
    end

    it "should return record when id & code exists" do
      cmd = FindItem.call({id: @item.id.to_s, code: @item.code})

      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: @item.id,
        name: @item.name,
        code: @item.code,
        desc: @item.desc
      )
    end

    it "should return error if record not found" do
      item = Item.new

      cmd = FindItem.call({id: item.id.to_s})

      expect(cmd.success?).to be false
      expect(cmd.errors).to eq ({ not_found: ["Record Not Found"] })
    end
  end
end

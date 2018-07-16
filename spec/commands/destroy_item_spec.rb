require 'rails_helper'

RSpec.describe DestroyItem, type: :command do
  context ".call" do
    it "should delete record from db" do
      record = Item.new(
        name: Faker::Lorem.word,
        code: Faker::Number.number(3)
      )
      record.save!
      
      cmd = DestroyItem.call(record.id.to_s)
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(Item.count).to eq 0
    end
  end
end

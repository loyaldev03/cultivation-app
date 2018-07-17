require 'rails_helper'

RSpec.describe DestroyUnitOfMeasure, type: :command do
  context ".call" do
    it "should delete record from db" do
      record = UnitOfMeasure.new(
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      )
      record.save!
      
      cmd = DestroyUnitOfMeasure.call(record.id.to_s)
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(UnitOfMeasure.count).to eq 0
    end
  end
end

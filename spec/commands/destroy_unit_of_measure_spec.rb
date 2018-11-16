require 'rails_helper'

RSpec.describe DestroyUnitOfMeasure, type: :command do
  context ".call" do
    it "should delete record from db" do
      initial_count = Common::UnitOfMeasure.count
      record = Common::UnitOfMeasure.new(
        name: Faker::Lorem.word,
        unit: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      )
      record.save!
      expect(Common::UnitOfMeasure.count).to eq initial_count + 1

      cmd = DestroyUnitOfMeasure.call(record.id.to_s)

      expect(cmd.errors.to_h).to eq({})
      expect(cmd.success?).to be true
      expect(Common::UnitOfMeasure.count).to eq initial_count
    end
  end
end

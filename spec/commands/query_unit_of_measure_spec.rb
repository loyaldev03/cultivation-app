require 'rails_helper'

RSpec.describe QueryUnitOfMeasure, type: :command do
  context ".call" do
    it "should return record when id exists" do
      Common::UnitOfMeasure.create!(
        name: "AK47",
        unit: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      )
      Common::UnitOfMeasure.create!(
        name: "AK47",
        unit: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      )
      cmd = QueryUnitOfMeasure.call(name: "AK47")
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.count).to eq 2
    end
  end
end

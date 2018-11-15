require 'rails_helper'

RSpec.describe QueryUnitOfMeasure, type: :command do
  context ".call" do
    it "should return record when id exists" do
      uom_name = Faker::Name.name
      Common::UnitOfMeasure.create!(
        name: uom_name,
        unit: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      )
      Common::UnitOfMeasure.create!(
        name: uom_name,
        unit: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      )
      cmd = QueryUnitOfMeasure.call(name: uom_name)
      expect(cmd.errors.to_h).to eq({})
      expect(cmd.success?).to be true
      expect(cmd.result.count).to eq 2
    end
  end
end

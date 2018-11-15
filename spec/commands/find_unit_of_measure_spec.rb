require 'rails_helper'

RSpec.describe FindUnitOfMeasure, type: :command do
  context "given uom args" do
    subject(:record) {
      Common::UnitOfMeasure.create!(
        name: Faker::Lorem.word,
        unit: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      )
    }

    it "should return record when id exists" do
      cmd = FindUnitOfMeasure.call(id: record.id.to_s)

      expect(cmd.errors.to_h).to eq({})
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: record.id,
        name: record.name,
        unit: record.unit,
        desc: record.desc,
      )
    end

    it "should return record when name exists" do
      cmd = FindUnitOfMeasure.call(name: record.name)

      expect(cmd.errors.to_h).to eq({})
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: record.id,
        name: record.name,
        unit: record.unit,
        desc: record.desc,
      )
    end

    it "should return record when unit exists" do
      cmd = FindUnitOfMeasure.call(unit: record.unit)

      expect(cmd.errors.to_h).to eq({})
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: record.id,
        name: record.name,
        unit: record.unit,
        desc: record.desc,
      )
    end

    it "should return record when id & unit exists" do
      cmd = FindUnitOfMeasure.call(id: record.id.to_s, unit: record.unit)

      expect(cmd.errors.to_h).to eq({})
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: record.id,
        name: record.name,
        unit: record.unit,
        desc: record.desc,
      )
    end

    it "should return error if record not found" do
      record = Common::UnitOfMeasure.new

      cmd = FindUnitOfMeasure.call(id: record.id.to_s)

      expect(cmd.success?).to be false
      expect(cmd.errors).to eq ({ not_found: ["Record Not Found"] })
    end
  end
end

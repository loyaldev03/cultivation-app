require 'rails_helper'

RSpec.describe FindFacility, type: :command do
  context ".call with args" do
    subject {
      Facility.create!(
        name: Faker::Lorem.word,
      )
    }

    it "return result when id exists" do
      cmd = FindFacility.call({id: subject.id.to_s})

      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: subject.id,
        name: subject.name,
      )
    end

    it "return result when name exists" do
      cmd = FindFacility.call({name: subject.name})

      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        id: subject.id,
        name: subject.name,
      )
    end

    it "return error if record not found" do
      new_record = Facility.new

      cmd = FindFacility.call({id: new_record.id.to_s})

      expect(cmd.success?).to be false
      expect(cmd.errors).to eq ({ not_found: ["Record Not Found"] })
    end
  end
end

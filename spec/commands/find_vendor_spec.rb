require 'rails_helper'

RSpec.describe FindVendor, type: :command do
  context ".call with args" do
    subject {
      Vendor.create!(
        name: Faker::Lorem.word,
      )
    }

    it "return result when id exists" do
      cmd = FindVendor.call({id: subject.id.to_s})

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
      cmd = FindVendor.call({name: subject.name})

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
      new_record = Vendor.new

      cmd = FindVendor.call({id: new_record.id.to_s})

      expect(cmd.success?).to be false
      expect(cmd.errors).to eq ({ not_found: ["Record Not Found"] })
    end
  end
end

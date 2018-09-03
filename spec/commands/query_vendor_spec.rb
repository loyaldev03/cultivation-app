require 'rails_helper'

RSpec.describe QueryVendor, type: :command do
  context ".call" do
    it "should return record when id exists" do
      fake_name = Faker::Lorem.word
      Inventory::Vendor.create!([
        { name: fake_name },
        { name: fake_name },
        { name: fake_name },
      ])
      
      cmd = QueryVendor.call(name: fake_name)
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.count).to eq 3
    end
  end
end

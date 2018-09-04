require 'rails_helper'

RSpec.describe DestroyVendor, type: :command do
  context ".call" do
    subject {
      Inventory::Vendor.create!(
        name: Faker::Lorem.word,
      )
    }
    it "should delete record from db" do
      cmd = DestroyVendor.call(subject.id.to_s)
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(Inventory::Vendor.count).to eq 0
    end
  end
end

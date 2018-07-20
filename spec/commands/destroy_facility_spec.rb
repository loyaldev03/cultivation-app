require 'rails_helper'

RSpec.describe DestroyFacility, type: :command do
  context ".call" do
    subject {
      Facility.create!(
        name: Faker::Lorem.word,
        code: Faker::Lorem.word,
      )
    }
    it "should delete record from db" do
      cmd = DestroyFacility.call(subject.id.to_s)
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(Facility.count).to eq 0
    end
  end
end

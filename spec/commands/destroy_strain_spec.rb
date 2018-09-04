require 'rails_helper'

RSpec.describe DestroyStrain, type: :command do
  context ".call" do
    subject {
      Common::Strain.create!(
        name: Faker::Lorem.word,
        desc: Faker::Lorem.sentence
      )
    }
    it "should delete record from db" do
      cmd = DestroyStrain.call(subject.id.to_s)
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(Common::Strain.count).to eq 0
    end
  end
end

require 'rails_helper'

RSpec.describe Cultivation::SaveSimpleBatch, type: :command do
  let(:valid_user) { User.create!(email: 'email@email.com', password: 'password', password_confirmation: 'password') }
  let(:facility) { Facility.create!(name: Faker::Lorem.word, code: Faker::Lorem.word) }
  let(:existing_fs) { create(:facility_strain) }
  
  context "create new record when no id" do
    it "should create a new batch with running batch no"
    it "should update common strains table if it is a new strain"
    it "should fail if required fields are missing or not found"
    it "should fail if user do not have correct permission"
  end
end

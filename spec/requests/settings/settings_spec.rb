require 'rails_helper'

RSpec.describe "Settings Page", :type => :request do
  # TODO: add context for non-admin
  context "Settings" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    it "show link to Facility module" do
      get settings_path

      expect(response.status).to eq(200)
      expect(response.body).to include("Facilities module")
    end

    it "show link to General Settings" do
      get settings_path

      expect(response.status).to eq(200)
      expect(response.body).to include("General Settings")
    end

    it "show link to Materials Settings" do
      get settings_path

      expect(response.status).to eq(200)
      expect(response.body).to include("Materials Settings")
    end
  end
end

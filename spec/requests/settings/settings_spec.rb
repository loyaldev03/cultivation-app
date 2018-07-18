require 'rails_helper'

RSpec.describe "/settings", :type => :request do
  # TODO: add context for non-admin
  context "user logged in" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    it "show link to Facility module" do
      get settings_path

      expect(response.status).to eq(200)
      expect(response.body).to include("Facilities module")
    end

    it "show link to General Settings page" do
      get settings_path

      expect(response.status).to eq(200)
      expect(response.body).to include("General Settings")
    end

    it "show link to Materials page" do
      get settings_path

      expect(response.status).to eq(200)
      expect(response.body).to include("Materials")
    end

    it "show link to Purchasing page" do
      get settings_path

      expect(response.status).to eq(200)
      expect(response.body).to include("Purchasing")
    end
  end
end

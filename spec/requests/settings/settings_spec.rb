require 'rails_helper'

RSpec.describe "Settings Page", :type => :request do
  # TODO: add context for non-admin
  context "Show Settings page for Admin" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    describe "GET Settings > Facilities" do
      it "should show Facility option" do
        get settings_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Facilities module")
      end
    end

    describe "GET Settings > Core" do
      it "should show General Settings option" do
        get settings_path

        expect(response.status).to eq(200)
        expect(response.body).to include("General Settings")
      end
    end
  end
end

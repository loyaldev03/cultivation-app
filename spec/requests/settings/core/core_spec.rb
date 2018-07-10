require 'rails_helper'

RSpec.describe "Core Settings - Home", :type => :request do
  context "Show Core Settings Page" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    describe "GET Settings > Core" do
      it "should render Core Settings" do
        get settings_core_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Core Settings")
      end
    end

    describe "GET Settings > Core" do
      it "should show General Settings link" do
        get settings_path

        expect(response.status).to eq(200)
        expect(response.body).to include("General Settings")
      end
    end
  end
end

require 'rails_helper'

RSpec.describe "Home - Dashboard", :type => :request do
  context "anonymous access" do
    describe "GET index" do
      it "should redirect to login page" do
        get root_path

        expect(response).to redirect_to new_user_session_url
      end
    end
  end

  context "admin access" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    describe "GET index" do
      it "should render dashboard" do
        get root_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Dashboard")
      end
    end
  end
end

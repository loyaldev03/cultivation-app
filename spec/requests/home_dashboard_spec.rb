require 'rails_helper'

RSpec.describe "Home - Dashboard" do
  context "denied anonymous access" do
    describe "GET index" do
      it "should redirect to login page" do
        get root_path

        expect(response).to redirect_to new_user_session_url
      end
    end
  end

  context "admin has logged-in" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    describe "GET index" do
      it "should render dashboard" do
        get "/"

        expect(response.status).to eq(200)
        expect(response.body).to include("Dashboard")
      end
    end
  end
end

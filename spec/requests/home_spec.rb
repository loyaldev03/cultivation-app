require 'rails_helper'

RSpec.describe "Home", type: :request do
  context "when logged out" do
    describe "GET index" do
      it "should redirect to login page" do
        get root_path

        expect(response).to redirect_to new_user_session_url
      end
    end
  end

  context "when logged in" do
    before do
      user = create(:user)
      login_as(user, scope: :user)
    end

    describe "GET index" do
      it "should render dashboard" do
        get root_path

        expect(response.status).to eq(302)
      end
    end
  end
end

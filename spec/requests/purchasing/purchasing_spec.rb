require 'rails_helper'

RSpec.describe "/purchasing", :type => :request do
  # TODO: add context for non-admin
  context "/index" do
    before do
      user = create(:user)
      login_as(user, :scope => :user)
    end

    it "show link to Vendors" do
      get purchasing_path

      expect(response.status).to eq(200)
      expect(response.body).to include("Vendors")
    end
  end
end

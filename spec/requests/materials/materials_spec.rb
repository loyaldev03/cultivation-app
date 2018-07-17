require 'rails_helper'

RSpec.describe "/materials", :type => :request do
  # TODO: add context for non-admin
  context "/index" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    it "show link to Items" do
      get materials_path

      expect(response.status).to eq(200)
      expect(response.body).to include("Items")
    end

    it "show link to Strains" do
      get materials_path

      expect(response.status).to eq(200)
      expect(response.body).to include("Strains")
    end
  end
end

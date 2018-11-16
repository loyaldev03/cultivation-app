require 'rails_helper'

RSpec.describe "/settings", :type => :request do
  # TODO: add context for non-admin
  context "when admin logged in" do
    before do
      user = create(:user)
      login_as(user, :scope => :user)
    end

    it "see links to different settings pages" do
      get settings_path

      expect(response.status).to eq(200)
      [
        "Company Info",
        "Team Settings",
        "General Settings",
        "Purchasing",
        "Facilities module",
      ].each do |links|
        expect(response.body).to include(links)
      end
    end
  end
end

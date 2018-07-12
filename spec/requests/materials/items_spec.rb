require 'rails_helper'

RSpec.describe "Material - Items", :type => :request do
  context "List all Items" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    describe "GET Items" do
      it "should render Item listing page" do
        get materials_items_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Items")
        expect(response.body).to include("Name")
        expect(response.body).to include("Code")
      end

      it "should render Add New button" do
        get materials_items_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Add New")
      end
    end
  end
end

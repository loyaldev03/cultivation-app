require 'rails_helper'

RSpec.describe "/materials", :type => :request do
  context "/items" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
      facility = Facility.create!(name: Faker::Lorem.word)
      Inventory::Item.create!([
        { name: Faker::Lorem.word, description: Faker::Lorem.sentences, facility: facility },
        { name: Faker::Lorem.word, description: Faker::Lorem.sentences, facility: facility }
      ])
    end

    describe "GET /" do
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

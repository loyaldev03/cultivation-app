require 'rails_helper'

RSpec.describe "/materials", :type => :request do
  context "/items" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
      Item.create!([
        { name: Faker::Lorem.word, desc: Faker::Lorem.sentences },
        { name: Faker::Lorem.word, desc: Faker::Lorem.sentences }
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

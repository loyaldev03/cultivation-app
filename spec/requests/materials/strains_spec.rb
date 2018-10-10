require 'rails_helper'

RSpec.describe "/materials", :type => :request do
  context "/strains" do
    before do
      user = create(:user)
      login_as(user, :scope => :user)
      Common::Strain.create!([
        { name: Faker::Lorem.word, desc: Faker::Lorem.sentences },
        { name: Faker::Lorem.word, desc: Faker::Lorem.sentences }
      ])
    end

    describe "GET /" do
      it "should render Strain listing page" do
        get materials_strains_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Strains")
        expect(response.body).to include("Name")
        expect(response.body).to include("Description")
      end

      it "should render Add New button" do
        get materials_strains_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Add New")
      end
    end
  end
end

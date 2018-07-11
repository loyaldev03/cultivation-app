require 'rails_helper'

RSpec.describe "Core Settings - Unit of Measure", :type => :request do
  context "List all UoM" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    describe "GET Settings > Core > Unit of Measure" do
      it "should render UoM listing page" do
        get settings_core_unit_of_measures_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Unit of Measure")
        expect(response.body).to include("Name")
        expect(response.body).to include("Code")
      end

      it "should render Add New button" do
        get settings_core_unit_of_measures_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Unit of Measure")
        expect(response.body).to include("Add New")
      end
    end
  end
end

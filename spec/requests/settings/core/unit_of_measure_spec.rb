require 'rails_helper'

RSpec.describe "Core Settings - Unit of Measure", :type => :request do
  context "List all UoM" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    describe "GET Settings > Core > Unit of Measure" do
      it "should render Unit of Measure listing page" do
        get settings_core_unit_of_measure_index_path

        expect(response.status).to eq(200)
        expect(response.body).to include("Unit of Measure")
      end
    end
  end
end

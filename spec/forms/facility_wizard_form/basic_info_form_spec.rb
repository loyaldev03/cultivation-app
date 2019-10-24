require "rails_helper"

RSpec.describe FacilityWizardForm::BasicInfoForm, type: :form do
  subject(:current_user) {
    create(:user)
  }

  context ".new" do
    it "init form_object with default facility_code" do
      form_object = FacilityWizardForm::BasicInfoForm.new

      # Sequence already define the format of the code to be F##
      expect(form_object.code).to eq (Sequence.facility_code_format % 1)
    end
  end

  context ".new with id" do
    subject(:facility) { create(:facility, :is_complete) }
    it "init form_object from saved record" do
      form_object = FacilityWizardForm::BasicInfoForm.new(facility.id)

      expect(form_object).to have_attributes(
        name: facility.name,
        code: facility.code,
        site_license: facility.site_license,
        timezone: facility.timezone,
        square_foot: facility.square_foot,
        canopy_square_foot: facility.canopy_square_foot,
        is_complete: facility.is_complete,
        is_enabled: facility.is_enabled,
        address_address: facility.address.address,
        address_city: facility.address.city,
        address_state: facility.address.state,
        address_zipcode: facility.address.zipcode,
        address_country: facility.address.country,
        address_main_number: facility.address.main_number,
      )
    end
  end

  context ".submit new" do
    it "saves to db" do
      form_object = FacilityWizardForm::BasicInfoForm.new
      params = {
        name: Faker::Name.name,
        code: Faker::Number.number(3),
      }

      form_object.submit(params, current_user)

      saved = Facility.find_by(code: params[:code])
      expect(form_object.valid?).to eq true
      expect(saved).to have_attributes(
        name: params[:name],
        code: params[:code],
      )
    end
  end

  context ".submit update" do
    subject(:facility) {
      create(:facility, :is_complete)
    }
    it "update to db" do
      form_object = FacilityWizardForm::BasicInfoForm.new(facility.id)
      params = {
        id: facility.id,
        name: Faker::Company.name,
        code: Faker::Number.number(3),
      }

      form_object.submit(params, current_user)

      saved = Facility.find_by(id: facility.id)
      expect(form_object.valid?).to eq true
      expect(form_object.id).to eq facility.id
      expect(form_object.name).to eq params[:name]
      expect(saved).to have_attributes(
        name: params[:name],
        code: params[:code],
      )
    end
  end
end

require "rails_helper"

RSpec.describe FacilityWizardForm::BasicInfoForm, type: :form do
  context "Setup New Facility" do
    it "should initialize form with default facility_code" do
      form_object = FacilityWizardForm::BasicInfoForm.new

      # Sequence already define the format of the code to be F##
      expect(form_object.code).to eq (Sequence.facility_code_format % 1)
    end

    it "should save facility after submit" do
      form_object = FacilityWizardForm::BasicInfoForm.new

      params = {
        id: form_object.id,
        name: Faker::Name.last_name,
        code: Faker::Number.number(3),
        address: Faker::Address.street_address
      }
      form_object.submit(params)

      saved_facility = Facility.find(form_object.id)
      expect(saved_facility).to_not be nil
      expect(saved_facility.name).to eq form_object.name
      expect(saved_facility.code).to eq form_object.code
      expect(saved_facility.address).to eq form_object.address
    end
  end

  context "Continue Setup Facility" do
    it "should initialize form with existing facility data" do
      facility = create(:facility,
                        code: Faker::Number.number(3),
                        address: Faker::Address.street_address)

      form_object = FacilityWizardForm::BasicInfoForm.new(facility)

      expect(form_object.id).to_not be nil
      expect(form_object.id).to eq facility.id
      expect(form_object.code).to eq facility.code
      expect(form_object.address).to eq facility.address
    end

    it "should save facility after submit" do
      facility = create(:facility,
                        code: Faker::Number.number(3),
                        address: Faker::Address.street_address)
      facility.save!
      form_object = FacilityWizardForm::BasicInfoForm.new(facility)

      params = {
        id: facility.id,
        name: Faker::Name.last_name,
        address: Faker::Address.street_address
      }
      form_object.submit(params)

      expect(form_object.id).to eq facility.id
      expect(form_object.code).to eq facility.code
      expect(form_object.address).to eq params[:address]
    end
  end
end

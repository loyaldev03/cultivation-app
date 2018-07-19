require "rails_helper"

RSpec.describe FacilityWizardForm::BasicInfoForm, type: :form do
  context ".new" do
    it "initialize new form object with default facility_code" do
      form_object = FacilityWizardForm::BasicInfoForm.new

      # Sequence already define the format of the code to be F##
      expect(form_object.code).to eq (Sequence.facility_code_format % 1)
    end
  end

  context ".new with id" do
    subject {
      Facility.create!(
        name: Faker::Lorem.word,
        code: Faker::Number.number(2),
        company_name: Faker::Company.name,
        state_license: Faker::Code.asin,
        site_license: Faker::Code.asin,
        timezone: Faker::Address.country,
        address: { 
          name: "Main",
          address: Faker::Address.country,
          city: Faker::Address.city,
          state: Faker::Address.state,
          zipcode: Faker::Address.zip,
          country: Faker::Address.country,
          main_number: Faker::PhoneNumber.phone_number,
          mobile_number: Faker::PhoneNumber.cell_phone,
          fax_number: Faker::PhoneNumber.phone_number,
          email: Faker::Internet.email,
        },
        is_complete: true,
        is_enabled: false,
      )
    }

    it "init form_object with existing attributes" do
      form_object = FacilityWizardForm::BasicInfoForm.new(subject.id.to_s)

      expect(form_object).to have_attributes(
        name: subject[:name],
        code: subject[:code],
        company_name: subject[:company_name],
        state_license: subject[:state_license],
        site_license: subject[:site_license],
        timezone: subject[:timezone],
        is_complete: subject[:is_complete],
        is_enabled: subject[:is_enabled],
      )

      expect(form_object.address).to have_attributes(
        name: "Main",
      )
    end
  end
end

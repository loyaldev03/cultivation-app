require 'rails_helper'

RSpec.describe SaveFacility, type: :command do
  context 'when params has no id' do
    it 'save as new record' do
      form_object = FacilityWizardForm::BasicInfoForm.new
      form_object.name = Faker::Lorem.word
      form_object.code = Faker::Code.asin
      SaveFacility.call(form_object)
      cmd = SaveFacility.call(form_object)

      expect(Facility.count).to eq 2
    end

    subject(:form_object) {
      form_object = FacilityWizardForm::BasicInfoForm.new
      form_object.name = Faker::Lorem.word
      form_object.code = Faker::Number.number(2)
      form_object.company_name = Faker::Company.name
      form_object.state_license = Faker::Code.asin
      form_object.site_license = Faker::Address.country
      form_object.timezone = Faker::Code.asin
      form_object.is_complete = true
      form_object.is_enabled = false
      form_object.address_address = Faker::Address.street_name
      form_object.address_city = Faker::Address.city
      form_object.address_state = Faker::Address.state
      form_object.address_zipcode = Faker::Address.zip
      form_object.address_country = Faker::Address.country
      form_object.address_main_number = Faker::PhoneNumber.phone_number
      form_object.address_fax_number = Faker::PhoneNumber.phone_number
      form_object
    }

    it 'save all attributes' do
      cmd = SaveFacility.call(form_object)

      saved = Facility.find_by(id: cmd.result.id)
      expect(cmd.success?).to be true
      expect(saved.c_at).to_not be nil
      expect(saved.u_at).to_not be nil
      expect(saved).to have_attributes(
        name: form_object.name,
        code: form_object.code,
        company_name: form_object.company_name,
        state_license: form_object.state_license,
        site_license: form_object.site_license,
        timezone: form_object.timezone,
        is_complete: form_object.is_complete,
        is_enabled: form_object.is_enabled
      )
      expect(cmd.result.address).to_not eq nil
      expect(saved.address).to have_attributes(
        address: form_object.address_address,
        city: form_object.address_city,
        state: form_object.address_state,
        zipcode: form_object.address_zipcode,
        country: form_object.address_country,
        main_number: form_object.address_main_number,
        fax_number: form_object.address_fax_number,
      )
    end
  end

  context 'when params contain :id' do
    subject(:facility) {
      facility = Facility.create!(
        name: Faker::Lorem.word,
        code: Faker::Number.number(2),
        company_name: Faker::Company.name,
        state_license: Faker::Code.asin,
        site_license: Faker::Address.country,
        timezone: Faker::Code.asin,
        is_complete: true,
        is_enabled: false,
        address: Address.new(
          address: Faker::Address.street_name,
          city: Faker::Address.city,
          state: Faker::Address.state,
          zipcode: Faker::Address.zip,
          country: Faker::Address.country,
          main_number: Faker::PhoneNumber.phone_number,
          fax_number: Faker::PhoneNumber.phone_number
        )
      )
    }

    it 'does not create new record' do
      form_object = FacilityWizardForm::BasicInfoForm.new(facility.id)

      cmd = SaveFacility.call(form_object)

      expect(Facility.count).to eq 1
      expect(cmd.errors.empty?).to be true
    end

    it 'does not delete timestamp attributes' do
      form_object = FacilityWizardForm::BasicInfoForm.new(facility.id.to_s)

      SaveFacility.call(form_object)

      saved = Facility.find(facility.id)
      expect([saved.c_at.nil?, saved.u_at.nil?]).to eq [false, false]
    end

    it 'update all attributes' do
      form_object = FacilityWizardForm::BasicInfoForm.new(facility.id)
      form_object.name = Faker::Lorem.word
      form_object.code = Faker::Number.number(2)

      SaveFacility.call(form_object)

      saved = Facility.find(facility.id)
      expect(saved).to have_attributes(
        name: form_object.name,
        code: form_object.code,
        company_name: form_object.company_name,
        state_license: form_object.state_license,
        site_license: form_object.site_license,
        timezone: form_object.timezone,
        is_complete: form_object.is_complete,
        is_enabled: form_object.is_enabled,
      )
      expect(saved.address).to have_attributes(
        address: form_object.address_address,
        city: form_object.address_city,
        state: form_object.address_state,
        zipcode: form_object.address_zipcode,
        country: form_object.address_country,
        main_number: form_object.address_main_number,
        fax_number: form_object.address_fax_number,
      )
    end

    it 'update attributes correctly in multiple calls' do
      form_object1 = FacilityWizardForm::BasicInfoForm.new(facility.id)
      form_object1.name = Faker::Lorem.word
      form_object2 = FacilityWizardForm::BasicInfoForm.new(facility.id)
      form_object2.name = Faker::Lorem.word

      SaveFacility.call(form_object1)
      SaveFacility.call(form_object2)

      saved = Facility.find(facility.id)
      expect(saved).to have_attributes(
        name: form_object2.name,
      )
    end
  end
end

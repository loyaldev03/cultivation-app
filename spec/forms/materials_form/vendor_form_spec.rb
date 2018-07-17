require "rails_helper"

RSpec.describe MaterialsForm::VendorForm, type: :form do
  context ".new" do
    it "initialize new form object" do
      form_object = MaterialsForm::VendorForm.new

      expect(form_object.id).to_not eq nil
    end
  end

  context ".new with id" do
    subject(:record) {
      Vendor.create!(
        name: Faker::Lorem.word,
        default_terms: Faker::Lorem.word,
        status: Faker::Lorem.word,
        notes: Faker::Lorem.sentences,
      )
    }

    it "init form_object with existing attributes" do
      form_object = MaterialsForm::VendorForm.new(record.id.to_s)

      expect(form_object.nil?).to be false
      expect(form_object).to have_attributes(
        name: record.name,
        default_terms: record.default_terms,
        status: record.status,
        notes: record.notes,
      )
    end
  end
end
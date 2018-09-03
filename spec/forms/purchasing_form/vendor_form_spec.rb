require "rails_helper"

RSpec.describe PurchasingForm::VendorForm, type: :form do
  context ".new" do
    it "initialize new form object" do
      form_object = PurchasingForm::VendorForm.new

      expect(form_object.id).to_not eq nil
    end
  end

  context ".new with id" do
    subject(:record) {
      Inventory::Vendor.create!(
        name: Faker::Lorem.word,
        default_terms: Faker::Lorem.word,
        status: Faker::Lorem.word,
        notes: Faker::Lorem.sentences,
      )
    }

    it "init form_object from saved record" do
      form_object = PurchasingForm::VendorForm.new(record.id.to_s)

      expect(form_object.nil?).to be false
      expect(form_object).to have_attributes(
        name: record.name,
        default_terms: record.default_terms,
        status: record.status,
        notes: record.notes,
      )
    end
  end

  context ".submit" do
    subject(:record) {
      Inventory::Vendor.create!(
        name: Faker::Lorem.word,
        default_terms: Faker::Lorem.word,
        status: Faker::Lorem.word,
        notes: Faker::Lorem.sentences,
      )
    }

    it "submit with params" do
      form_object = PurchasingForm::VendorForm.new

      params = {
        id: record.id.to_s,
        name: Faker::Name.name,
        default_terms: Faker::Lorem.word,
        status: Faker::Lorem.word,
        notes: Faker::Lorem.sentences
      }
      form_object.submit(params)

      saved = Inventory::Vendor.find(record.id)
      expect(form_object.valid?).to be true
      expect(form_object).to have_attributes(
        name: params[:name],
        default_terms: params[:default_terms],
        status: params[:status],
        notes: params[:notes],
      )
    end
  end
end

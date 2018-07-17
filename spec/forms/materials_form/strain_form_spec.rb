require "rails_helper"

RSpec.describe MaterialsForm::StrainForm, type: :form do
  context ".new" do
    it "initialize new form object" do
      form_object = MaterialsForm::StrainForm.new

      expect(form_object.id).to_not eq nil
    end
  end

  context ".new with id" do
    subject(:record) {
      Strain.create!(
        name: Faker::Lorem.word,
        desc: Faker::Lorem.sentence,
      )
    }

    it "init form_object with existing attributes" do
      form_object = MaterialsForm::StrainForm.new(record.id.to_s)

      expect(form_object.nil?).to be false
      expect(form_object).to have_attributes(
        name: record.name,
        desc: record.desc,
      )
    end
  end
end
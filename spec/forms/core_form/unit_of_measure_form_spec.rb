require "rails_helper"

RSpec.describe CoreForm::UnitOfMeasureForm, type: :form do
  context ".new" do
    it "initialize new form object" do
      form_object = CoreForm::UnitOfMeasureForm.new

      expect(form_object.id).to_not eq nil
    end
  end

  context ".new with record id" do
    subject(:record) {
      Common::UnitOfMeasure.create!(
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      )
    }

    it "initialize form_object with existing attributes" do
      form_object = CoreForm::UnitOfMeasureForm.new(record.id)

      expect(record.id.nil?).to be false
      expect(form_object).to have_attributes(
        name: record.name,
        code: record.code,
        desc: record.desc,
      )
    end
  end
end

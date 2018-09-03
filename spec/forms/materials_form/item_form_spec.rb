require "rails_helper"

RSpec.describe MaterialsForm::ItemForm, type: :form do
  context ".new" do
    it "initialize new form object" do
      form_object = MaterialsForm::ItemForm.new

      expect(form_object.id).to_not eq nil
    end
  end

  context ".new with record id" do
    subject(:record) {
      Inventory::Item.create!(
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
        uom: Faker::Lorem.word,
      )
    }

    it "initialize form_object with existing attributes" do
      form_object = MaterialsForm::ItemForm.new(record.id.to_s)

      expect(form_object.nil?).to be false
      expect(form_object).to have_attributes(
        name: record.name,
        code: record.code,
        desc: record.desc,
        uom: record.uom
      )
    end
  end
end
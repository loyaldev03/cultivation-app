require "rails_helper"

RSpec.describe MaterialsForm::ItemForm, type: :form do
  context "New Item" do
    it "should initialize item" do
      form_object = MaterialsForm::ItemForm.new

      expect(form_object.id).to_not eq nil
    end
  end
end

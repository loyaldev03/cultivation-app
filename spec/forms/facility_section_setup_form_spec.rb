require 'rails_helper'

RSpec.describe FacilitySectionSetupForm, type: :model do
  context "initializing with facility and room" do
    before do
      @facility = create(:facility, :after_step_3)
    end

    it "should initialize with first room and first section" do
      @room = @facility.rooms.first
      form_object = FacilitySectionSetupForm.new(@facility, @room.id.to_s)

      expect(form_object.room_id).to eq @room.id
      expect(form_object.section_name).to eq 'Section 1'
      expect(form_object.section_code).to eq 'Sec1'
      expect(form_object.section_desc).to eq nil
      expect(form_object.section_purpose).to eq 'storage'
      expect(form_object.section_storage_types).to eq nil
      expect(form_object.section_cultivation_types).to eq nil
      expect(form_object.section_row_count).to eq 10
      expect(form_object.section_shelf_count).to eq 5
      expect(form_object.section_shelf_capacity).to eq 20
    end

    it "should validates name & code during submit" do
      @room = @facility.rooms.first
      form_object = FacilitySectionSetupForm.new(@facility, @room.id.to_s)

      params = {
        section_name: "",
        section_code: ""
      }
      form_object.submit(params)

      expect(form_object.errors.size).to be 2
    end

    it "should validate unique section code" do
      @room = @facility.rooms.first
      form_object = FacilitySectionSetupForm.new(@facility, @room.id.to_s)

      params = {
        section_name: "Section 1",
        section_code: "Sec2",
      }
      form_object.submit(params)

      expect(form_object.section_is_complete).to be false
      expect(form_object.errors.size).to be 1
    end

    it "should generate sections if valid" do
      @room = @facility.rooms.first
      form_object = FacilitySectionSetupForm.new(@facility, @room.id.to_s)

      params = {
        section_name: "Section 1",
        section_code: "Sec1",
      }
      form_object.submit(params)

      facility = Facility.find_by(id: @facility.id)
      sections = facility.rooms.first.sections
      expect(form_object.section_is_complete).to be false
      expect(sections.size).to be 2
    end
  end
end

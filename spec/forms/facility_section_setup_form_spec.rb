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
      expect(form_object.section_row_count).to eq 3
      expect(form_object.section_shelf_count).to eq 2
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

    it "should save section if valid" do
      @room = @facility.rooms.first
      form_object = FacilitySectionSetupForm.new(@facility, @room.id.to_s)

      params = {
        section_name: Faker::Name.name,
        section_code: Faker::Number.number(1),
        section_desc: Faker::Lorem.sentence,
        section_purpose: Faker::Lorem.word,
        section_custom_purpose: Faker::Lorem.word,
        section_storage_types: [Faker::Lorem.word, Faker::Lorem.word],
        section_cultivation_types: [Faker::Lorem.word, Faker::Lorem.word, Faker::Lorem.word],
        section_row_count: Faker::Number.number(1).to_i,
        section_shelf_count: Faker::Number.number(1).to_i,
        section_shelf_capacity: Faker::Number.number(2).to_i,
      }
      form_object.submit(params)

      facility = Facility.find_by(id: @facility.id)
      section = facility.rooms.first.sections.first
      expect(section.name).to eq params[:section_name]
      expect(section.code).to eq params[:section_code]
      expect(section.desc).to eq params[:section_desc]
      expect(section.purpose).to eq params[:section_purpose]
      expect(section.custom_purpose).to eq params[:section_custom_purpose]
      expect(section.storage_types).to eq params[:section_storage_types]
      expect(section.cultivation_types).to eq params[:section_cultivation_types]
      expect(section.row_count).to eq params[:section_row_count]
      expect(section.shelf_count).to eq params[:section_shelf_count]
      expect(section.shelf_capacity).to eq params[:section_shelf_capacity]
      expect(section.is_complete).to be false
      expect(facility.rooms.first.sections.size).to be 2
    end
  end
end

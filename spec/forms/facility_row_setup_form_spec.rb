require 'rails_helper'

RSpec.describe FacilityRowSetupForm, type: :model do
  context "initializing form_object with correct rows" do
    before do
      @facility = create(:facility, :facility_with_rooms_sections)
    end

    it "should initialize with default row when not present" do
      room = @facility.rooms.first
      section = room.sections.first

      form_object = FacilityRowSetupForm.new(@facility, room.id.to_s, section.id.to_s)

      expect(section.rows.blank?).to be true
      expect(form_object.row_id).to_not be nil
    end

    it "should initialize with first row when no row_id provided" do
      room = @facility.rooms.first
      section = room.sections.first
      row1 = Row.new({code: "Row1"})
      row2 = Row.new({code: "Row2"})
      section.rows = [row1, row2]

      form_object = FacilityRowSetupForm.new(@facility, room.id.to_s, section.id.to_s)

      expect(section.rows.blank?).to be false
      expect(form_object.row_id).to eq row1.id
    end

    it "should initialize with row for corresponding row_id" do
      room = @facility.rooms.first
      section = room.sections.first
      row1 = Row.new({code: "Row1"})
      row2 = Row.new({code: "Row2"})
      section.rows = [row1, row2]

      form_object = FacilityRowSetupForm.new(
        @facility,
        room.id.to_s,
        section.id.to_s,
        row2.id.to_s)

      expect(section.rows.blank?).to be false
      expect(form_object.row_id).to eq row2.id
      expect(form_object.row.id).to eq row2.id
    end
  end

  context "initializing form_object with correct shelves" do
    before do
      @facility = create(:facility, :facility_with_rooms_sections)
      @room = @facility.rooms.first
      @section = @room.sections.first
      row1 = Row.new({code: "Row1"})
      row2 = Row.new({code: "Row2"})
      @section.rows = [row1, row2]
      @facility.save!
    end

    it "should initialize default list of shelves when none available" do
      shelf_count = Faker::Number.number(1).to_i
      @section.shelf_count = shelf_count

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.shelves.size).to be shelf_count
    end

    it "should initialize with existing shelves when available" do
      @section.shelf_count = Faker::Number.number(1).to_i
      shelf1 = Shelf.new({ code: Faker::Number.number(3).to_i })
      shelf2 = Shelf.new({ code: Faker::Number.number(3).to_i })
      @section.rows.first.shelves = [shelf1, shelf2]

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.shelves.size).to be @section.shelf_count
      expect(form_object.shelves.first.code).to be shelf1.code
    end
  end

  context "submit form_object" do
    it "should save new row given correct inputs" do
      @facility = create(:facility, :facility_with_rooms_sections)
      @room = @facility.rooms.first
      @section = @room.sections.first
      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      params = {
        row_id: form_object.row.id.to_s,
        row_name: 'First Row',
        row_code: 'Rw1'
      }
      form_object.submit(params)

      saved_facility = Facility.find_by(id: form_object.facility_id.to_s)
      saved_section = saved_facility.rooms.first.sections.first
      saved_row = saved_section.rows.first
      expect(saved_row.name).to eq params[:row_name]
      expect(form_object.valid?).to be true
    end

    it "should update row given correct inputs" do
      facility = create(:facility, :facility_with_rooms_sections_row)
      room = facility.rooms.first
      section = room.sections.first
      row = section.rows.first

      params = {
        row_id: row.id.to_s,
        row_name: '2nd First Row',
        row_code: '2nd Rw1'
      }
      form_object = FacilityRowSetupForm.new(facility, room.id.to_s, section.id.to_s, params[:row_id])
      form_object.submit(params)

      saved_facility = Facility.find_by(id: form_object.facility_id)
      expect(saved_facility.c_at).to_not eq facility.c_at
      expect(form_object.valid?).to be true
      expect(form_object.row_id).to eq row.id
      expect(form_object.row_name).to eq params[:row_name]
      expect(form_object.row_code).to eq params[:row_code]
      saved_section = saved_facility.rooms.first.sections.first
      expect(saved_section.id).to eq section.id
      saved_row = saved_section.rows.detect { |r| r.id.to_s == params[:row_id] }
      expect(saved_row.id.to_s).to eq params[:row_id]
      #debugger
      # expect(saved_row.name).to eq params[:row_name]
      # expect(saved_row.code).to eq params[:row_code]
    end
  end
end

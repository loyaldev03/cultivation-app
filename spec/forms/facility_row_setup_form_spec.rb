require 'rails_helper'

RSpec.describe FacilityRowSetupForm, type: :model do
  context "initializing form_object with correct rows" do
    before(:each) do
      @facility = create(:facility, :facility_with_rooms_sections)
      @room = @facility.rooms.first
      @section = @room.sections.first
    end

    it "should initialize section with default number of rows" do
      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(@section.rows.size).to eq @section.row_count
    end

    it "should initialize a new row within section.rows" do
      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.row_id).to_not be nil
      expect(@section.rows.blank?).to_not be true
    end

    it "should initialize default rows within section given a row_id" do
      row = Row.new

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s, row.id.to_s)

      expect(form_object.section.rows.blank?).to be false
      expect(form_object.section.rows.first.id).to eq row.id
    end

    it "should initialize with first row when no row_id provided" do
      row1 = Row.new({code: "Row1"})
      row2 = Row.new({code: "Row2"})
      @section.rows = [row1, row2]

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(@section.rows.blank?).to be false
      expect(form_object.row_id).to eq row1.id
      expect(@section.rows.size).to eq @section.row_count
    end

    it "should initialize with row for corresponding row_id" do
      row1 = Row.new({code: "Row1"})
      row2 = Row.new({code: "Row2"})
      @section.rows = [row1, row2]

      form_object = FacilityRowSetupForm.new(
        @facility,
        @room.id.to_s,
        @section.id.to_s,
        row2.id.to_s)

      expect(@section.rows.blank?).to be false
      expect(form_object.row_id).to eq row2.id
      expect(form_object.row.id).to eq row2.id
      expect(@section.rows.size).to eq @section.row_count
    end
  end

  context "initializing form_object with correct shelves" do
    before(:each) do
      @facility = create(:facility, :facility_with_rooms_sections)
      @room = @facility.rooms.first
      @section = @room.sections.first
      @section.rows.build({code: "Row1"})
      @section.rows.build({code: "Row2"})
    end

    it "should initialize default list of shelves when none available" do
      @section.shelf_count = 8

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.row.shelves.size).to eq @section.shelf_count
    end

    it "should initialize with existing shelves when available" do
      @section.shelf_count = 6
      shelf1 = Shelf.new({ code: Faker::Number.number(3).to_i })
      shelf2 = Shelf.new({ code: Faker::Number.number(3).to_i })
      @section.rows.first.shelves = [shelf1, shelf2]

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.row.shelves.size).to eq @section.shelf_count
      expect(form_object.row.shelves[0].code).to eq shelf1.code
      expect(form_object.row.shelves[1].code).to eq shelf2.code
    end
  end

  context "submit form_object" do
    before(:each) do
      @facility = create(:facility, :facility_with_rooms_sections_row)
      @room = @facility.rooms.first
      @section = @room.sections.first
      @section.shelf_count = 3
    end
    it "should save new row given correct inputs" do
      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      params = {
        row_id: form_object.row.id.to_s,
        row_name: 'First Row',
        row_code: 'Rw1'
      }
      form_object.submit(params)

      saved_facility = Facility.find_by(id: form_object.facility_id)
      saved_section = saved_facility.rooms.first.sections.first
      saved_row = saved_section.rows.first
      expect(saved_row.name).to eq params[:row_name]
      expect(form_object.valid?).to be true
    end

    it "should update row given correct inputs" do
      row = @section.rows.first

      params = {
        row_id: row.id.to_s,
        row_name: '2nd First Row',
        row_code: '2nd Rw1'
      }
      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)
      form_object.submit(params)

      saved_facility = Facility.find_by(id: form_object.facility_id)
      saved_section = saved_facility.rooms.first.sections.first
      saved_row = saved_section.rows.detect { |r| r.id.to_s == params[:row_id] }
      expect(saved_row.id.to_s).to eq params[:row_id]
      expect(saved_row.name).to eq params[:row_name]
      expect(saved_row.code).to eq params[:row_code]
      expect(saved_section.id).to eq @section.id
      expect(saved_facility.c_at).to_not eq @facility.c_at
      expect(form_object.row.id.to_s).to eq params[:row_id]
      expect(form_object.row.id.to_s).to eq params[:row_id]
      expect(form_object.valid?).to be true
      expect(form_object.row_id).to eq row.id
      expect(form_object.row_name).to eq params[:row_name]
      expect(form_object.row_code).to eq params[:row_code]
    end

    it "should update shelves given correct inputs" do
      row = @section.rows.first

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s, row.id.to_s)
      shelf1_id = form_object.row.shelves[0].id.to_s
      shelf2_id = form_object.row.shelves[1].id.to_s
      params = {
        row_name: '3nd First Row',
        row_code: '3nd Rw1',
        shelves: [
          { id: shelf1_id, 
            code: "shelf-1",
            capacity: Faker::Number.number(2).to_i,
            desc: Faker::Lorem.sentence },
          { id: shelf2_id,
            code: "shelf-2",
            capacity: Faker::Number.number(2).to_i,
            desc: Faker::Lorem.sentence },
        ]
      }
      form_object.submit(params)

      saved_facility = Facility.find_by(id: form_object.facility_id)
      saved_section = saved_facility.rooms.first.sections.first
      saved_row = saved_section.rows.detect { |r| r.id == row.id }
      expect(row.name).to eq saved_row.name
      expect(saved_row.shelves.blank?).to be false
      expect(saved_row.shelves[0].id.to_s).to eq params[:shelves][0][:id]
      expect(saved_row.shelves[1].id.to_s).to eq params[:shelves][1][:id]
      expect(saved_row.shelves[0].code).to eq params[:shelves][0][:code]
      expect(saved_row.shelves[1].code).to eq params[:shelves][1][:code]
      expect(saved_row.shelves[1].desc).to eq params[:shelves][1][:desc]
    end
  end
end

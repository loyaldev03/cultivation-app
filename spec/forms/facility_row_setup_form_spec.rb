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

    it "should define next_row correctly give no row_id" do
      row1 = Row.new({code: "Row1"})
      row2 = Row.new({code: "Row2"})
      @section.rows = [row1, row2]
      @section.row_count = 2

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.rows.size).to eq 2
      expect(form_object.row.id).to eq row1.id
      expect(form_object.next_row.blank?).to eq false
      expect(form_object.next_row.id).to eq row2.id
    end

    it "should define next_row correctly given row_id" do
      row1 = Row.new({code: "Row1"})
      row2 = Row.new({code: "Row2"})
      row3 = Row.new({code: "Row3"})
      @section.rows = [row1, row2, row3]
      @section.row_count = 3

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s, row2.id.to_s)

      expect(form_object.rows.size).to eq 3
      expect(form_object.row.id).to eq row2.id
      expect(form_object.next_row.blank?).to eq false
      expect(form_object.next_row.id).to eq row3.id
    end

    it "should return nil given last row_id" do
      row1 = Row.new({code: "Row1"})
      row2 = Row.new({code: "Row2"})
      row3 = Row.new({code: "Row3"})
      @section.rows = [row1, row2, row3]
      @section.row_count = 3

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s, row3.id.to_s)

      expect(form_object.next_row.blank?).to eq true
    end

    it "should define next section" do
      @room.section_count = 2
      next_section = @room.sections[1]
      expect(next_section.blank?).to eq false
      expect(@room.sections.size).to eq 2

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.next_section.blank?).to eq false
      expect(form_object.next_section.id).to eq next_section.id
    end

    it "should define next section given section_id" do
      @room.section_count = 3
      @room.sections = [build(:section), build(:section), build(:section)]
      @section = @room.sections[1]

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.next_section.blank?).to eq false
      expect(form_object.next_section.id).to eq @room.sections[2].id
    end

    it "should return nil given last section_id" do
      @room.section_count = 3
      @room.sections = [build(:section), build(:section), build(:section)]
      @section = @room.sections[2]

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s)

      expect(form_object.next_section.blank?).to eq true
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
      expect(form_object.errors.blank?).to be true
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
      expect(row.shelves.size).to eq 0
      expect(@section.shelf_count).to eq 3

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s, row.id.to_s)
      expect(form_object.row_shelves.size).to eq 3
      expect(form_object.missing_shelf_count).to eq 3

      shelf1_id = form_object.row.shelves[0].id.to_s
      shelf2_id = form_object.row.shelves[1].id.to_s
      params = {
        row_name: '3rd First Row',
        row_code: '3rd Rw1',
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

      expect(form_object.missing_shelf_count).to eq 3
      expect(form_object.row_shelves.size).to eq 2
      saved_facility = Facility.find_by(id: form_object.facility_id)
      saved_section = saved_facility.rooms.first.sections.first
      saved_row = saved_section.rows.detect { |r| r.id == row.id }
      expect(form_object.section_shelf_count).to eq 3
      expect(form_object.errors.blank?).to be true
      expect(form_object.valid?).to be true
      expect(saved_row.name).to eq "3rd First Row"
      expect(saved_row.code).to eq "3rd Rw1"
      expect(saved_row.shelves[0].id.to_s).to eq params[:shelves][0][:id]
      expect(saved_row.shelves[0].code).to eq params[:shelves][0][:code]
      expect(saved_row.shelves[0].desc).to eq params[:shelves][0][:desc]
      expect(saved_row.shelves[0].capacity).to eq params[:shelves][0][:capacity]
      expect(saved_row.shelves[1].id.to_s).to eq params[:shelves][1][:id]
      expect(saved_row.shelves[1].code).to eq params[:shelves][1][:code]
      expect(saved_row.shelves[1].desc).to eq params[:shelves][1][:desc]
      expect(saved_row.shelves[1].capacity).to eq params[:shelves][1][:capacity]
    end

    it "should show errors given duplicate shelf-code inputs" do
      row = @section.rows.first

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s, row.id.to_s)
      shelf1_id = form_object.row.shelves[0].id.to_s
      shelf2_id = form_object.row.shelves[1].id.to_s
      params = {
        row_name: '3rd First Row',
        row_code: '3rd Rw1',
        shelves: [
          { id: shelf1_id,
            code: "shelf-1",
            capacity: Faker::Number.number(2).to_i,
            desc: Faker::Lorem.sentence },
          { id: shelf2_id,
            code: "shelf-1", # purposely use same shelf code
            capacity: Faker::Number.number(2).to_i,
            desc: Faker::Lorem.sentence },
        ]
      }
      form_object.submit(params)

      saved_facility = Facility.find_by(id: form_object.facility_id)
      saved_section = saved_facility.rooms.first.sections.first
      saved_row = saved_section.rows.detect { |r| r.id == row.id }
      expect(form_object.errors.blank?).to be false
      expect(form_object.valid?).to be false
      expect(saved_row.name).to_not eq "3rd First Row"
    end

    it "should show errors given missing shelf-code inputs" do
      row = @section.rows.first

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s, row.id.to_s)
      shelf1_id = form_object.row.shelves[0].id.to_s
      shelf2_id = form_object.row.shelves[1].id.to_s
      params = {
        row_name: '3rd First Row',
        row_code: '3rd Rw1',
        shelves: [
          { id: shelf1_id,
            code: "shelf-1",
            capacity: Faker::Number.number(2).to_i,
            desc: Faker::Lorem.sentence },
          { id: shelf2_id,
            code: "", # purposely use empty code
            capacity: Faker::Number.number(2).to_i,
            desc: Faker::Lorem.sentence },
        ]
      }
      form_object.submit(params)

      saved_facility = Facility.find_by(id: form_object.facility_id)
      saved_section = saved_facility.rooms.first.sections.first
      saved_row = saved_section.rows.detect { |r| r.id == row.id }
      expect(form_object.errors.blank?).to be false
      expect(form_object.errors.full_messages[0]).to eq "Shelves id #2 is required"
      expect(form_object.valid?).to be false
      expect(saved_row.name).to_not eq "3rd First Row"
    end

    it "should update shelf is_complete given correct inputs" do
      row = @section.rows.first

      form_object = FacilityRowSetupForm.new(@facility, @room.id.to_s, @section.id.to_s, row.id.to_s)

      params = {
        row_name: row.name,
        row_code: row.code,
        shelves: [
          { id: form_object.row.shelves[0].id.to_s,
            code: "Shelf1",
            capacity: Faker::Number.number(2).to_i,
            desc: Faker::Lorem.sentence },
          { id: form_object.row.shelves[1].id.to_s,
            code:  "Shelf2",
            capacity: Faker::Number.number(2).to_i,
            desc: Faker::Lorem.sentence },
        ]
      }
      form_object.submit(params)

      saved_facility = Facility.find_by(id: form_object.facility_id)
      saved_section = saved_facility.rooms.first.sections.first
      saved_row = saved_section.rows.detect { |r| r.id == row.id }
      expect(saved_row.is_complete).to be true
    end
  end
end

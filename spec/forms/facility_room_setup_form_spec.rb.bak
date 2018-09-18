require 'rails_helper'

RSpec.describe FacilityRoomSetupForm, type: :model do
  context "initializing with facility and room" do
    before(:each) do
      @facility = create(:facility, :after_step_2)
    end

    it "should initialize with first room when no room_id given" do
      @room = @facility.rooms.first

      form_object = FacilityRoomSetupForm.new(@facility)

      expect(form_object.room_id).to eq @room.id
    end

    it "should initialize with given room when room_id given" do
      @room = @facility.rooms.last

      form_object = FacilityRoomSetupForm.new(@facility, @room.id.to_s)

      expect(form_object.room_id).to eq @room.id
    end

    it "should initialize have section to false given 1 section" do
      @room = @facility.rooms.first
      @room.section_count = 1

      form_object = FacilityRoomSetupForm.new(@facility, @room.id.to_s)

      expect(form_object.room_have_sections).to eq false
    end

    it "should initialize have section to true given 2 sections" do
      @room = @facility.rooms.first
      @room.section_count = 2

      form_object = FacilityRoomSetupForm.new(@facility, @room.id.to_s)

      expect(form_object.room_have_sections).to eq true
    end

    it "should initialize correct name_of_room" do
      @room0 = @facility.rooms[0]
      @room1 = @facility.rooms[1]

      form_object = FacilityRoomSetupForm.new(@facility, @room0.id.to_s)

      expect(form_object.name_of_room(0)).to eq @room0.name
      expect(form_object.name_of_room(1)).to eq @room1.name
    end

    it "should initialize correct room number" do
      @room = @facility.rooms[1]

      form_object = FacilityRoomSetupForm.new(@facility, @room.id.to_s)

      expect(form_object.current_room_number).to eq 2
    end

    it "should save room when given correct inputs" do
      @room = @facility.rooms.first

      form_object = FacilityRoomSetupForm.new(@facility, @room.id.to_s)
      form_params = {
        room_name: Faker::Name.name,
        room_code: Faker::Number.number(2),
        room_desc: Faker::Lorem.sentence,
        room_section_count: Faker::Number.number(2).to_i,
        room_have_sections: 'true'
      }
      form_object.submit(form_params)

      expect(form_object.valid?).to eq true
      saved_facility = Facility.find_by(id: @facility.id)
      saved_room = saved_facility.rooms.first
      expect(saved_room.name).to eq form_params[:room_name]
      expect(saved_room.desc).to eq form_params[:room_desc]
      expect(saved_room.section_count).to eq form_params[:room_section_count]
    end
  end
end


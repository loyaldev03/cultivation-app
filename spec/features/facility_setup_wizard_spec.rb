require 'rails_helper'

RSpec.feature "Facility Setup Wizard", type: :feature do
  context "admin has logged-in" do
    before do
      user = create(:user, :admin)
      login_as(user, :scope => :user)
    end

    scenario "Facility wizard step 1" do
      visit facility_setup_new_path

      fill_in "Name", :with => "Facility Name 1"
      fill_in "Code", :with => "Fas1"
      click_button "Save & Continue" # Submit Basic Info

      expect(page).to have_text("Step 2")
      expect(Facility.count).to eq 1
    end

    scenario "Facility wizard step 2" do
      facility = create(:facility, :after_step_1)
      visit facility_setup_new_path(facility_id: facility.id, step: 2)

      fill_in "How many rooms in this facility?", :with => "2"
      click_button "Save & Continue" # Submit Room Count

      expect(page).to have_text("Step 3")
      expect(Facility.count).to eq 1
    end

    scenario "Facility wizard step 3" do
      facility = create(:facility, :after_step_2)
      visit facility_setup_new_path(facility_id: facility.id, step: 3)

      fill_in "Room Name", :with => "Room 1"
      fill_in "Room ID", :with => "Rm1"
      fill_in "Description", :with => "Some description for Room 1"
      click_button "Save & Continue"
      fill_in "How many sections in this room?", :with => 8
      click_button "Next"

      expect(page).to have_text("Step 4")
      facility = Facility.find_by(id: facility.id)
      expect(facility.rooms.first.section_count).to eq 8
    end

    scenario "Facility wizard step 4 - Storage" do
      facility = create(:facility, :after_step_3)
      room = facility.rooms.first
      visit facility_setup_new_path(facility_id: facility.id, step: 4, room_id: room.id)

      # fake_custom_purpose = Faker::Lorem.word

      fill_in "Section Name", :with => "Section 1"
      fill_in "Section ID", :with => "S1"
      fill_in "Description", :with => "S 1"
      choose("Storage")
      check("Consumable")
      check("Sales Item")
      fill_in "No of row", :with => 2
      fill_in "No of shelves in each row", :with => 3
      fill_in "Capacity for each shelf", :with => 10
      click_button "Save & Continue"

      expect(page).to have_text("Step 5")
      room = Facility.find_by(id: facility.id).rooms.first
      section = room.sections.first
      expect(section.name).to eq "Section 1"
      expect(section.code).to eq "S1"
      expect(section.desc).to eq "S 1"
      expect(section.purpose).to eq "storage"
      expect(section.storage_types.sort).to eq ["consumable", "sales_item"].sort
      expect(section.cultivation_types).to be nil
      expect(section.row_count).to eq 2
      expect(section.shelf_count).to eq 3
      expect(section.shelf_capacity).to eq 10
      expect(section.is_complete).to eq false
    end

    scenario "Facility wizard step 4 - Cultivation" do
      facility = create(:facility, :after_step_3)
      room = facility.rooms.first
      visit facility_setup_new_path(facility_id: facility.id, step: 4, room_id: room.id)

      fake_name = Faker::Lorem.word
      fake_row_count = Faker::Number.number(1).to_i
      fake_capacity = Faker::Number.number(2).to_i

      fill_in "Section Name", :with => fake_name
      fill_in "Section ID", :with => "S1"
      fill_in "Description", :with => "S 1"
      choose("Cultivation")
      find('input#facility_section_cultivation_types_clone', visible: false).set(true) # check("Clone")
      find('input#facility_section_cultivation_types_flower', visible: false).set(true) # check("Flower")
      fill_in "No of row", :with => fake_row_count
      fill_in "No of shelves in each row", :with => 3
      fill_in "Capacity for each shelf", :with => fake_capacity
      click_button "Save & Continue"

      expect(page).to have_text("Step 5")
      room = Facility.find_by(id: facility.id).rooms.first
      section = room.sections.first
      expect(section.name).to eq fake_name
      expect(section.code).to eq "S1"
      expect(section.desc).to eq "S 1"
      expect(section.purpose).to eq "cultivation"
      expect(section.storage_types).to be nil
      expect(section.cultivation_types).to eq ["clone", "flower"]
      expect(section.row_count).to eq fake_row_count
      expect(section.shelf_count).to eq 3
      expect(section.shelf_capacity).to eq fake_capacity
      expect(section.is_complete).to eq false
    end

    scenario "Facility wizard step 5 - Rows & Shelves" do
      facility = create(:facility, :facility_with_rooms_sections)
      room = facility.rooms.first
      section = room.sections.first
      section.row_count = 2
      section.shelf_count = 2
      section.save!
      visit facility_setup_new_path(facility_id: facility.id, room_id: room.id, section_id: section.id, step: 5)

      fake_row_name = Faker::Lorem.word
      fake_row_code = Faker::Lorem.word
      fill_in "Row Name", with: fake_row_name
      fill_in "Row ID", with: fake_row_code
      all("input[name='facility[shelves][][code]']").each { |e| e.set(Faker::Lorem.word) }
      click_button "Save & Continue"

      row = Facility.find_by(id: facility.id).rooms.first.sections.first.rows.first
      expect(row.id).to_not be nil
      expect(row.name).to eq fake_row_name
      expect(row.code).to eq fake_row_code
      expect(row.shelves.size).to eq 2
      expect(row.shelves[0].code).to_not eq nil
      expect(row.shelves[1].code).to_not eq nil
      expect(row.section.row_count).to eq 2
      expect(row.section.shelf_count).to eq 2
      expect(row.section.id).to_not be nil
    end
  end
end

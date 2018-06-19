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
  end
end

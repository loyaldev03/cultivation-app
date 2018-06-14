require 'rails_helper'

RSpec.feature "Facility Setup Wizard", type: :feature do
  scenario "Facility wizard step 1" do
    visit facility_setup_new_path

    fill_in "Name", :with => "Facility Name 1"
    fill_in "Code", :with => "Fas1"
    click_button "Save & Continue"

    expect(page).to have_text("Step 2")
    expect(Facility.count).to eq 1
  end

  # scenario "Facility wizard step 2" do
  #   visit facility_setup_new_path

  #   fill_in "Name", :with => "Facility Name 1"
  #   fill_in "Code", :with => "Fas1"
  #   click_button "Save & Continue"
  #   click_button "Save & Continue"

  #   expect(page).to have_text("Step 3")
  #   expect(Facility.count).to eq 1
  # end
end

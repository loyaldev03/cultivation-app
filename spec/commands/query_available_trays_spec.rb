require 'rails_helper'

RSpec.describe QueryAvailableTrays, type: :command, focus: true do
  subject(:facility) {
    create(:facility, :is_complete)
  }
  subject(:user) {
    create(:user)
  }
  context ".call" do
    it "done" do

      
      expect(facility.is_complete).to eq true
    end
  end
end

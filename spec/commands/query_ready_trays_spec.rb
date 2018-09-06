require 'rails_helper'

RSpec.describe QueryReadyTrays, type: :command do
  subject! {
    create(:facility, :is_complete)
  }
  context ".call" do
    it "should return flatten trays list" do
      # Prepare
      subject.rooms.each do |room|
        room.rows.each do |row|
          row.shelves.each do |shelf|
            shelf.trays.each do |tray|
              tray.save!
            end
          end
        end
      end

      # Perform
      query_cmd = QueryReadyTrays.call()

      # Validate
      expect(Facility.count).to eq 1
      expect(Tray.count).to eq 24
      expect(query_cmd.success?).to eq true
      expect(query_cmd.result.size).to eq 24
    end
  end
end

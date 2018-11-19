require "rails_helper"

RSpec.describe Inventory::QueryPlants, type: :command do
  let (:facility) do
    facility = create(:facility, :is_complete)
    facility.rooms.each do |room|
      room.rows.each do |row|
        row.shelves.each do |shelf|
          shelf.trays.each(&:save!)
        end
      end
    end
    # Each tray in the facility have the capacity of 10
    facility
  end
  let(:facility_strain) { build(:facility_strain) }
  let(:clone_room) do
    facility.rooms.detect do |r|
      r.purpose == Constants::CONST_CLONE
    end
  end
  let(:first_row) { clone_room.rows.first }
  let(:clone_tray) do
    first_shelf = first_row.shelves.first
    first_shelf.trays.last
  end
  let(:batch) do
    create(:batch,
            facility_id: facility.id,
            start_date: Time.strptime("2018/08/01", DATE_FORMAT),
            quantity: 5)
  end

  context ".call" do
    it "return correct number of plants" do
      # Prepare - Create plants and make sure it is empty in the beginning.
      expect(Inventory::Plant.count).to eq(0)
      sample_count = Faker::Number.number(1).to_i
      sample_count.times do
        create(:plant, :clone,
                      cultivation_batch: batch,
                      location_id: clone_tray.id,
                      facility_strain: facility_strain)
      end
      # Also create a plant of different growth stage
      create(:plant, :flower,
                    cultivation_batch: batch,
                    location_id: clone_tray.id,
                    facility_strain: facility_strain)

      # Execute
      cmd_result = Inventory::QueryPlants.call(
        batch_id: batch.id,
        growth_stages: [:clone],
      ).result

      # Validate
      expect(cmd_result.size).to eq(sample_count)
    end
  end
end

require "rails_helper"

RSpec.describe QueryAvailableCapacity, type: :command do
  let(:facility) do
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
  context ".call" do
    let(:clone_room) do
      facility.rooms.detect do |r|
        r.purpose == Constants::CONST_CLONE
      end
    end
    let(:first_row) { clone_room.rows.first }
    let(:last_tray) do
      first_shelf = first_row.shelves.first
      first_shelf.trays.last
    end
    let(:batch) do
      create(:batch, :active,
             facility_id: facility.id,
             start_date: Time.strptime("2018/08/01", DATE_FORMAT),
             quantity: 5)
    end
    let!(:default_plan) do
      # Create a Tray booking record in the db. The other tests
      # would check against this plan for overlapping.
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: first_row.id,
                  shelf_id: last_tray.shelf_id,
                  tray_id: last_tray.id,
                  capacity: 5,
                  phase: Constants::CONST_CLONE,
                  start_date: Time.strptime("2018/08/01", DATE_FORMAT),
                  end_date: Time.strptime("2018/08/17", DATE_FORMAT))
      p1
    end

    it "return remaining capacity when overlapping - A" do
      # Prepare - Create a new booking that overlaps with default plan
      new_booking = {
        facility_id: facility.id,
        purpose: Constants::CONST_CLONE,
        start_date: Time.strptime("2018/07/25", DATE_FORMAT),
        end_date: Time.strptime("2018/08/01", DATE_FORMAT),
      }

      # Execute
      cmd = QueryAvailableCapacity.call(new_booking)

      # Validate
      expect(cmd.result).to eq(10 * 8 - default_plan.capacity)
    end

    it "return remaining capacity when not overlapping - B" do
      new_booking = {
        facility_id: facility.id,
        purpose: Constants::CONST_CLONE,
        start_date: Time.strptime("2018/07/25", DATE_FORMAT),
        end_date: Time.strptime("2018/08/17", DATE_FORMAT),
      }

      # Execute
      cmd = QueryAvailableCapacity.call(new_booking)

      # Validate
      expect(cmd.result).to eq(10 * 8 - default_plan.capacity)
    end

    it "return full capacity when batch excluded - B (Exclude batch)" do
      new_booking = {
        facility_id: facility.id,
        exclude_batch_id: batch.id,
        purpose: Constants::CONST_CLONE,
        start_date: Time.strptime("2018/07/25", DATE_FORMAT),
        end_date: Time.strptime("2018/08/17", DATE_FORMAT),
      }

      # Execute
      cmd = QueryAvailableCapacity.call(new_booking)

      # Validate
      expect(cmd.result).to eq(10 * 8)
    end

    it "return remaining capacity when overlapping end_date - G" do
      new_booking = {
        facility_id: facility.id,
        purpose: Constants::CONST_CLONE,
        start_date: Time.strptime("2018/08/17", DATE_FORMAT),
        end_date: Time.strptime("2018/08/22", DATE_FORMAT),
      }

      # Execute
      cmd = QueryAvailableCapacity.call(new_booking)

      # Validate
      expect(cmd.result).to eq(10 * 8 - default_plan.capacity)
    end

    it "return full capacity when not overlapping - Y" do
      new_booking = {
        facility_id: facility.id,
        purpose: Constants::CONST_CLONE,
        start_date: Time.strptime("2018/08/18", DATE_FORMAT),
        end_date: Time.strptime("2018/08/31", DATE_FORMAT),
      }

      # Execute
      cmd = QueryAvailableCapacity.call(new_booking)

      # Validate
      expect(cmd.result).to eq(10 * 8)
    end
  end
end

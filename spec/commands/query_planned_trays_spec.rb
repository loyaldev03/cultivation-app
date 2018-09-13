require 'rails_helper'

RSpec.describe QueryPlannedTrays, type: :command do
  subject(:facility) {
    create(:facility, :is_complete)
  }
  context ".call" do
    subject(:first_room) {
      facility.rooms.first
    }
    subject(:first_row) {
      first_room.rows.first
    }
    subject(:first_shelf) {
      first_row.shelves.first
    }
    subject(:first_tray) {
      first_shelf.trays.first
    }
    subject(:last_tray) {
      first_shelf.trays.last
    }
    subject(:schedule_start_date) {
      DateTime.strptime("2018/08/01", "%Y/%m/%d")
    }
    subject(:schedule_end_date) {
      DateTime.strptime("2018/08/17", "%Y/%m/%d")
    }

    it "should not include trays planned prior to schedule" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/07/31", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 0
    end

    it "should include trays planned with end-date overlapping schedule start-date" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/01", "%Y/%m/%d") # Overlap with schedule start date
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)
      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays planned within schedule start & end date boundaries" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/05", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/15", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)
      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays planned with same schedule start & end date" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/01", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays planned beyond schedule start & end date boundaries" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/07/31", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/20", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays planned start same date but ends ealier" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/01", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/10", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays planned start later than schedule start date and ends ealier" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/05", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/15", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays planned start later than schedule start-date and ends at same end-date" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/10", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays planned start later than schedule start-date and ends after end-date" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/10", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/20", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays planned start on morning of end-date" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/20", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should not include trays planned start after schedule end-date" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/18", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/20", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 0
    end

    it "should not include trays planned start after schedule end-date" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/18", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/20", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 0
    end

    it "should include trays planned start ealier than schedule start-date and ends on same schedule end-date" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/07/26", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should include trays that last 1 day of schedule end date" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: first_room.id,
                  row_id: first_row.id,
                  shelf_id: first_shelf.id,
                  tray_id: first_tray.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end
  end
end

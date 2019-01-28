require 'rails_helper'

RSpec.describe QueryPlannedTrays, type: :command do
  context ".call" do
    let(:facility) do
      facility = create(:facility, :is_complete)
      facility.rooms.each do |room|
        room.rows.each do |row|
          row.shelves.each do |shelf|
            shelf.trays.each(&:save!)
          end
        end
      end
      facility
    end
    let(:clone_room1) { facility.rooms.first }
    let(:clone_row1) { clone_room1.rows.first }
    let(:clone_shelf1) { clone_row1.shelves.first }
    let(:clone_tray1) { clone_shelf1.trays.first }
    let(:clone_tray2) { clone_shelf1.trays.last }
    let(:schedule_start_date) { Time.strptime("2018/08/01", DATE_FORMAT) }
    let(:schedule_end_date) { Time.strptime("2018/08/17", DATE_FORMAT) }

    it "should not include trays planned prior to schedule" do
      # Prepare
      p1_start_date = Time.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/07/31", DATE_FORMAT)
      create(:tray_plan,
              facility_id: facility.id,
              room_id: clone_room1.id,
              row_id: clone_row1.id,
              shelf_id: clone_shelf1.id,
              tray_id: clone_tray1.id,
              phase: Constants::CONST_CLONE,
              start_date: p1_start_date,
              end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 0
    end

    it "should include trays planned with end_date overlapping start_date" do
      # Prepare
      p1_start_date = Time.strptime("2018/07/25", DATE_FORMAT)
      # let end_date overlaps with previously scheduled's start_date
      p1_end_date = Time.strptime("2018/08/01", DATE_FORMAT)
      create(:tray_plan,
              facility_id: facility.id,
              room_id: clone_room1.id,
              row_id: clone_row1.id,
              shelf_id: clone_shelf1.id,
              tray_id: clone_tray1.id,
              start_date: p1_start_date,
              end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end

    it "should excluded trays planned with params excluded_batch_id" do
      # Prepare
      p1_start_date = Time.strptime("2018/07/25", DATE_FORMAT)
      # let end_date overlaps with previously scheduled's start_date
      p1_end_date = Time.strptime("2018/08/01", DATE_FORMAT)
      tp = create(:tray_plan,
              facility_id: facility.id,
              room_id: clone_room1.id,
              row_id: clone_row1.id,
              shelf_id: clone_shelf1.id,
              tray_id: clone_tray1.id,
              start_date: p1_start_date,
              end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date, facility.id, tp.batch_id)

      # Validate
      expect(res.result.size).to eq 0
    end

    it "should include trays planned within schedule start & end date boundaries" do
      # Prepare
      # A tray has been booked within the schedule start_date & end_date
      p1_start_date = Time.strptime("2018/08/05", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/15", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/07/31", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/20", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/10", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/05", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/15", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/10", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/10", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/20", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/20", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/18", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/20", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/18", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/20", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/07/26", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
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
      p1_start_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1 = create(:tray_plan,
                  facility_id: facility.id,
                  room_id: clone_room1.id,
                  row_id: clone_row1.id,
                  shelf_id: clone_shelf1.id,
                  tray_id: clone_tray1.id,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      # Perform
      res = QueryPlannedTrays.call(schedule_start_date, schedule_end_date)

      # Validate
      expect(res.result.size).to eq 1
    end
  end
end

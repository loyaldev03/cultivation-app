require 'rails_helper'

RSpec.describe QueryPlannedTrays, type: :command do
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
  let(:current_user) { create(:user, facilities: [facility.id]) }
  let(:strain) { create(:facility_strain, facility: facility) }
  # Clone Locations
  let(:clone_room) { facility.rooms.detect { |r| r.purpose == "clone" } }
  let(:clone_row1) { clone_room.rows.first }
  let(:clone_shelf1) { clone_row1.shelves.first }
  let(:clone_tray1) { clone_shelf1.trays.first }
  let(:clone_tray2) { clone_shelf1.trays.last }
  # Veg Locations
  let(:veg_room) { facility.rooms.detect { |r| r.purpose == "veg" } }
  let(:veg_row1) { veg_room.rows.first }
  let(:veg_shelf1) { veg_row1.shelves.first }
  let(:veg_tray1) { veg_shelf1.trays.first }
  let(:veg_tray2) { veg_shelf1.trays.last }
  # Flower Locations
  let(:flower_room) { facility.rooms.detect { |r| r.purpose == "flower" } }
  let(:flower_row1) { flower_room.rows.first }
  let(:flower_shelf1) { flower_row1.shelves.first }
  let(:flower_tray1) { flower_shelf1.trays.first }
  let(:flower_tray2) { flower_shelf1.trays.last }
  # Dry Locations
  let(:dry_room) { facility.rooms.detect { |r| r.purpose == "dry" } }
  let(:dry_row1) { dry_room.rows.first }
  let(:dry_shelf1) { dry_row1.shelves.first }
  let(:dry_tray1) { dry_shelf1.trays.first }
  let(:dry_tray2) { dry_shelf1.trays.last }
  # Cure Locations
  let(:cure_room) { facility.rooms.detect { |r| r.purpose == "cure" } }
  let(:cure_row1) { cure_room.rows.first }
  let(:cure_shelf1) { cure_row1.shelves.first }
  let(:cure_tray1) { cure_shelf1.trays.first }
  let(:cure_tray2) { cure_shelf1.trays.last }

  context "verify test data is correct" do
    it "verify facility data is setup correctly" do
      expect(Tray.count).to be 48
      expect(clone_room.purpose).to eq "clone"
      expect(clone_tray1.capacity).to eq 10
      expect(veg_room.purpose).to eq "veg"
      expect(veg_tray1.capacity).to eq 10
      expect(flower_room.purpose).to eq "flower"
      expect(flower_tray1.capacity).to eq 10
      expect(dry_room.purpose).to eq "dry"
      expect(dry_tray1.capacity).to eq 10
      expect(cure_room.purpose).to eq "cure"
      expect(cure_tray1.capacity).to eq 10
    end
  end

  context ".call - when 2 batches exists in db" do
    let(:start_date) { Time.zone.parse("01/01/2019").beginning_of_day }
    let(:plant1_id) { BSON::ObjectId.new }
    let(:plant2_id) { BSON::ObjectId.new }
    let!(:batch1) do
      create(:batch, :scheduled,
             facility: facility,
             start_date: start_date,
             quantity: 6,
             batch_source: 'clones_from_mother',
             facility_strain: strain)
    end
    let!(:batch2) do
      create(:batch, :scheduled,
             facility: facility,
             start_date: start_date,
             quantity: 3,
             batch_source: 'clones_from_mother',
             facility_strain: strain)
    end
    let!(:batch1_tasks) do
      t1  = create(:task, batch: batch1, name: "Clone", phase: "clone", indelible: "group", indent: 0,
                   duration: 8, start_date: batch1.start_date, end_date: batch1.start_date + 8.days)
      t11 = create(:task, batch: batch1, name: "Grow", phase: "clone", indelible: "staying", indent: 1,
                   duration: 8, start_date: batch1.start_date, end_date: batch1.start_date + 8.days)
      t2  = create(:task, batch: batch1, name: "Veg", phase: "veg", indelible: "group", indent: 0,
                  duration: 14, start_date: t1.end_date, end_date: t1.end_date + 14.days)
      t21 = create(:task, batch: batch1, name: "Grow",phase: "veg", indelible: "staying", indent: 1,
                  duration: 14, start_date: t1.end_date, end_date: t1.end_date + 14.days)
      t3  = create(:task, batch: batch1, name: "Flower", phase: "flower", indelible: "group", indent: 0,
                  duration: 56, start_date: t2.end_date, end_date: t2.end_date + 56.days)
      t31 = create(:task, batch: batch1, name: "Grow", phase: "flower", indelible: "staying", indent: 1,
                  duration: 56, start_date: t2.end_date, end_date: t2.end_date + 56.days)
      t4  = create(:task, batch: batch1, name: "Harvest", phase: "Harvest", indelible: "group", indent: 0,
                  duration: 2, start_date: t3.end_date, end_date: t3.end_date + 2.days)
      t5  = create(:task, batch: batch1, name: "Dry", phase: "dry", indelible: "group", indent: 0,
                  duration: 7, start_date: t4.end_date, end_date: t4.end_date + 7.days)
      t51 = create(:task, batch: batch1, name: "Drying", phase: "dry", indelible: "staying", indent: 1,
                  duration: 7, start_date: t4.end_date, end_date: t4.end_date + 7.days)
      t6  = create(:task, batch: batch1, name: "Trim", phase: "trim", indelible: "group", indent: 0,
                  duration: 2, start_date: t5.end_date, end_date: t5.end_date + 2.days)
      t7  = create(:task, batch: batch1, name: "Cure", phase: "cure", indelible: "group", indent: 0,
                  duration: 5, start_date: t6.end_date, end_date: t6.end_date + 5.days)
      t71 = create(:task, batch: batch1, name: "Curing", phase: "cure", indelible: "staying", indent: 1,
                  duration: 5, start_date: t6.end_date, end_date: t6.end_date + 5.days)
      [t1, t11,
       t2, t21,
       t3, t31,
       t4,
       t5, t51,
       t6,
       t7, t71]
    end
    let(:batch2_tasks) do
      t1  = create(:task, batch: batch2, name: "Clone", phase: "clone", indelible: "group", indent: 0,
                   duration: 8, start_date: batch2.start_date, end_date: batch2.start_date + 8.days)
      t11 = create(:task, batch: batch2, name: "Grow", phase: "clone", indelible: "staying", indent: 1,
                   duration: 8, start_date: batch2.start_date, end_date: batch2.start_date + 8.days)
      t2  = create(:task, batch: batch2, name: "Veg", phase: "veg", indelible: "group", indent: 0,
                  duration: 14, start_date: t1.end_date, end_date: t1.end_date + 14.days)
      t21 = create(:task, batch: batch2, name: "Grow",phase: "veg", indelible: "staying", indent: 1,
                  duration: 14, start_date: t1.end_date, end_date: t1.end_date + 14.days)
      t3  = create(:task, batch: batch2, name: "Flower", phase: "flower", indelible: "group", indent: 0,
                  duration: 56, start_date: t2.end_date, end_date: t2.end_date + 56.days)
      t31 = create(:task, batch: batch2, name: "Grow", phase: "flower", indelible: "staying", indent: 1,
                  duration: 56, start_date: t2.end_date, end_date: t2.end_date + 56.days)
      t4  = create(:task, batch: batch2, name: "Harvest", phase: "Harvest", indelible: "group", indent: 0,
                  duration: 2, start_date: t3.end_date, end_date: t3.end_date + 2.days)
      t5  = create(:task, batch: batch2, name: "Dry", phase: "dry", indelible: "group", indent: 0,
                  duration: 7, start_date: t4.end_date, end_date: t4.end_date + 7.days)
      t51 = create(:task, batch: batch2, name: "Drying", phase: "dry", indelible: "staying", indent: 1,
                  duration: 7, start_date: t4.end_date, end_date: t4.end_date + 7.days)
      t6  = create(:task, batch: batch2, name: "Trim", phase: "trim", indelible: "group", indent: 0,
                  duration: 2, start_date: t5.end_date, end_date: t5.end_date + 2.days)
      t7  = create(:task, batch: batch2, name: "Cure", phase: "cure", indelible: "group", indent: 0,
                  duration: 5, start_date: t6.end_date, end_date: t6.end_date + 5.days)
      t71 = create(:task, batch: batch2, name: "Curing", phase: "cure", indelible: "staying", indent: 1,
                  duration: 5, start_date: t6.end_date, end_date: t6.end_date + 5.days)
      [t1, t11,
       t2, t21,
       t3, t31,
       t4,
       t5, t51,
       t6,
       t7, t71]
    end

    let(:batch1_plans) do
      [
        {
          id: "plant#1",
          phase: "clone",
          quantity: 6,
          serialNo: "M001",
          trays: [
            {
              plant_id: plant1_id.to_s,
              room_id: clone_room.id.to_s,
              row_id: clone_row1.id.to_s,
              shelf_id: clone_shelf1.id.to_s,
              tray_id: clone_tray1.id.to_s,
              tray_capacity: 3,
              tray_code: clone_tray1.code.to_s,
            },
            {
              plant_id: plant2_id.to_s,
              room_id: clone_room.id.to_s,
              row_id: clone_row1.id.to_s,
              shelf_id: clone_shelf1.id.to_s,
              tray_id: clone_tray2.id.to_s,
              tray_capacity: 3,
              tray_code: clone_tray2.code.to_s,
            }
          ]
        }
      ]
    end

    it "verify tray plans are saved", focus: true do
      # Prepare - Create a new booking that overlaps with default plan
      Cultivation::SaveTrayPlans.call(batch1.id, batch1_plans, 6)

      # [ t1, t11,  # clone
      #   t2, t21,  # veg
      #   t3, t31,  # flower
      #   t4,       # harvest
      #   t5, t51,  # dry
      #   t6,       # trim
      #   t7, t71 ] # cure

      # Verify "clone" phase's TrayPlans are saved
      phase_start = batch1_tasks[1].start_date
      phase_end = batch1_tasks[1].end_date
      q1 = QueryAvailableCapacity.call(facility_id: facility.id,
                                       start_date: phase_start,
                                       end_date: phase_end,
                                       purpose: "clone")
      expect(q1.result).to eq 74

      # Verify "veg" phase's TrayPlans are saved
      phase_start = batch1_tasks[3].start_date
      phase_end = batch1_tasks[3].end_date
      q2 = QueryAvailableCapacity.call(facility_id: facility.id,
                                       start_date: phase_start,
                                       end_date: phase_end,
                                       purpose: "veg")
      expect(q2.result).to eq 80
    end

    it "verify batch 'staying' task setup correctly" do
      # Verify phases saved in batch 1
      cmd = Cultivation::QueryBatchPhases.call(batch1, Constants::CULTIVATION_PHASES_1V)
      expect(cmd.success?).to be true
      expect(cmd.result.count).to be 5

      # Verify phases saved in batch 2
      # cmd = Cultivation::QueryBatchPhases.call(batch2, Constants::CULTIVATION_PHASES_1V)
      # expect(cmd.success?).to be true
      # expect(cmd.result.count).to be 5
    end

    it "should have 2 batches in database" do
      expect(Cultivation::Batch.count).to eq 2
      expect(Cultivation::Task.count).to eq(2 * 14)
      # TODO: Add test plans into both batch
    end
  end

  context ".call - without setup of batches" do
    let(:schedule_start_date) { Time.strptime("2018/08/01", DATE_FORMAT) }
    let(:schedule_end_date) { Time.strptime("2018/08/17", DATE_FORMAT) }

    it "should not include trays planned prior to schedule" do
      # Prepare
      p1_start_date = Time.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/07/31", DATE_FORMAT)
      create(:tray_plan,
              facility_id: facility.id,
              room_id: clone_room.id,
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
              room_id: clone_room.id,
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
              room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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
                  room_id: clone_room.id,
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

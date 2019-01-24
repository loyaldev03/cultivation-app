require "rails_helper"

RSpec.describe QueryAvailableTrays, type: :command do
  subject! do
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

  context ".call(start_date, end_date)" do
    let(:clone_room) { subject.rooms.detect { |r| r.purpose == Constants::CONST_CLONE } }
    let(:last_row) { clone_room.rows.last }
    let(:last_shelf) { last_row.shelves.last }
    let(:last_tray) { last_shelf.trays.last }
    let(:start_date) { Time.strptime("2018/08/01", DATE_FORMAT) }
    let(:end_date) { Time.strptime("2018/08/17", DATE_FORMAT) }
    let(:batch) do
      create(:batch, :active,
             facility_id: subject.id,
             start_date: start_date,
             quantity: 5)
    end

    it "Condition A" do
      # Prepare - Create a booking that overlaps with the start date
      p1_start_date = Time.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/01", DATE_FORMAT)
      p1_capacity = 5
      p1 = create(:tray_plan,
              facility_id: subject.id,
              batch: batch,
              room_id: clone_room.id,
              row_id: last_row.id,
              shelf_id: last_shelf.id,
              tray_id: last_tray.id,
              capacity: p1_capacity,
              phase: Constants::CONST_CLONE,
              start_date: p1_start_date,
              end_date: p1_end_date)

      # p "------------------"
      # p batch.start_date
      # p subject.id == batch.facility_id && subject.id == p1.facility_id
      # p p1.batch_id == batch.id
      # p p1.tray_id == last_tray.id
      # p p1.phase == clone_room.purpose # IMPORTANT
      # p "------------------"

      # Execute
      query_cmd = QueryAvailableTrays.call(
        start_date,
        end_date,
        facility_id: subject.id, purpose: [Constants::CONST_CLONE],
      )

      # Validate
      # 2 Rows * 2 Shelves * 2 Trays - result should flatten trays record and
      # return 8 rows of record
      expect(query_cmd.result.length).to eq 8
      target = query_cmd.result.detect { |tp| tp.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition B" do
      # Prepare - Create a booking that overlaps until the end date
      p1_start_date = Time.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {
        facility_id: subject.id,
        phase: Constants::CONST_CLONE,
      })

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition C" do
      # Prepare - Create a booking that overlaps over end date
      p1_start_date = Time.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/20", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition D" do
      # Prepare - Create a booking that within start and end date
      p1_start_date = Time.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/16", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition E" do
      # Prepare - Booking that ends at same end date
      p1_start_date = Time.strptime("2018/08/02", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition F" do
      # Prepare - Booking that start and ends on same date
      p1_start_date = Time.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition G" do
      # Prepare - Booking start on end date
      p1_start_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/22", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition H" do
      # Prepare - Booking that start within start and end date
      p1_start_date = Time.strptime("2018/08/03", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/15", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition J" do
      # Prepare - Booking that start on same date but ends after end date
      p1_start_date = Time.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/19", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition K" do
      # Prepare
      p1_start_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/17", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition L" do
      # Prepare
      p1_start_date = Time.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/1", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq p1_capacity
      expect(target.remaining_capacity).to eq (10 - p1_capacity)
    end

    it "Condition M - Consolidate 2 Tray Plans" do
      # Prepare
      p1_start_date = Time.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/1", DATE_FORMAT)
      p1_capacity = 3
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      p2_start_date = Time.strptime("2018/08/02", DATE_FORMAT)
      p2_end_date = Time.strptime("2018/08/3", DATE_FORMAT)
      p2_capacity = 10
      p2 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p2_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p2_start_date,
                  end_date: p2_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date, {facility_id: subject.id, purpose: 'clone'})

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq 13
      expect(target.remaining_capacity).to eq -3
    end

    it "Condition X - Not Overlapping / Before Schedule" do
      # Prepare
      p1_start_date = Time.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/07/31", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq 0
      expect(target.remaining_capacity).to eq 10
    end

    it "Condition Y - Not Overlapping / After Schedule" do
      # Prepare
      p1_start_date = Time.strptime("2018/08/18", DATE_FORMAT)
      p1_end_date = Time.strptime("2018/08/31", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  batch: batch,
                  room_id: clone_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  phase: [Constants::CONST_CLONE],
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t.tray_id.to_s == last_tray.id.to_s }
      expect(target.planned_capacity).to eq 0
      expect(target.remaining_capacity).to eq 10
    end
  end
end

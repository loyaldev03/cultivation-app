require 'rails_helper'

DATE_FORMAT = "%Y/%m/%d"

RSpec.describe QueryAvailableTrays, type: :command, focus: true do
  subject! {
    facility = create(:facility, :is_complete)

    facility.rooms.each do |room|
      room.rows.each do |row|
        row.shelves.each do |shelf|
          shelf.trays.each do |tray|
            tray.save!
          end
        end
      end
    end

    facility
  }

  context ".call(start_date, end_date)" do
    let(:last_room) { subject.rooms.last }
    let(:last_row) { last_room.rows.last }
    let(:last_shelf) { last_row.shelves.last }
    let(:last_tray) { last_shelf.trays.last }
    let(:start_date) { DateTime.strptime("2018/08/01", DATE_FORMAT) }
    let(:end_date) { DateTime.strptime("2018/08/17", DATE_FORMAT) }

    it "Condition A" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/01", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(query_cmd.result.size).to eq 24
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition B" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/17", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition C" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/20", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition D" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/16", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition E" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/02", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/17", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition F" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/17", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition G" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/17", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/22", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition H" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/03", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/15", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition J" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/19", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition K" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/17", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/17", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition L" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/1", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq p1_capacity
      expect(target[:remaining_capacity]).to eq (10 - p1_capacity)
    end

    it "Condition M - Consolidate 2 Tray Plans" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/01", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/1", DATE_FORMAT)
      p1_capacity = 3
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      p2_start_date = DateTime.strptime("2018/08/02", DATE_FORMAT)
      p2_end_date = DateTime.strptime("2018/08/3", DATE_FORMAT)
      p2_capacity = 10
      p2 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p2_capacity,
                  start_date: p2_start_date,
                  end_date: p2_end_date)

      query_cmd = QueryAvailableTrays.(start_date, end_date, {facility_id: subject.id})

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq 13
      expect(target[:remaining_capacity]).to eq -3
    end

    it "Condition X - Not Overlapping / Before Schedule" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/07/31", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq 0
      expect(target[:remaining_capacity]).to eq 10
    end

    it "Condition Y - Not Overlapping / After Schedule" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/18", DATE_FORMAT)
      p1_end_date = DateTime.strptime("2018/08/31", DATE_FORMAT)
      p1_capacity = Faker::Number.number(1).to_i
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: p1_capacity,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_s }
      expect(target[:planned_capacity]).to eq 0
      expect(target[:remaining_capacity]).to eq 10
    end
  end
end

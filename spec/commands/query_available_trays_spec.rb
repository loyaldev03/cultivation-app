require 'rails_helper'

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

  context ".call" do
    let(:last_room) { subject.rooms.last }
    let(:last_row) { last_room.rows.last }
    let(:last_shelf) { last_row.shelves.last }
    let(:last_tray) { last_shelf.trays.last }
    let(:start_date) { DateTime.strptime("2018/08/01", "%Y/%m/%d") }
    let(:end_date) { DateTime.strptime("2018/08/17", "%Y/%m/%d") }

    it "Condition A" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/01", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 4,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 4
      expect(target[:remaining_capacity]).to eq 6

      # target_model = Cultivation::TrayResult.new(target)
      # expect(target_model.facility_id).to eq subject.id.to_bson_id
      # expect(target_model.tray_capacity).to eq 10
      # expect(target_model.planned_capacity).to eq 3
      # expect(last_tray).not_to be nil
      # expect(query_cmd.success?).to eq true
      # expect(query_cmd.result.size).to eq Tray.count
    end

    it "Condition B" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 4,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 4
      expect(target[:remaining_capacity]).to eq 6
    end

    it "Condition C" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/20", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 5,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 5
      expect(target[:remaining_capacity]).to eq 5
    end

    it "Condition D" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/01", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/16", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 6,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 6
      expect(target[:remaining_capacity]).to eq 4
    end

    it "Condition E" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/02", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 1,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 1
      expect(target[:remaining_capacity]).to eq 9
    end

    it "Condition F" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/01", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 1,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 1
      expect(target[:remaining_capacity]).to eq 9
    end

    it "Condition G" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/22", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 1,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 1
      expect(target[:remaining_capacity]).to eq 9
    end

    it "Condition H" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/03", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/15", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 2,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 2
      expect(target[:remaining_capacity]).to eq 8
    end

    it "Condition K" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/17", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 3,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 3
      expect(target[:remaining_capacity]).to eq 7
    end

    it "Condition J" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/01", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/19", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 8,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 8
      expect(target[:remaining_capacity]).to eq 2
    end

    it "Condition X" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/07/25", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/07/31", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 8,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 0
      expect(target[:remaining_capacity]).to eq 10
    end

    it "Condition Y" do
      # Prepare
      p1_start_date = DateTime.strptime("2018/08/18", "%Y/%m/%d")
      p1_end_date = DateTime.strptime("2018/08/31", "%Y/%m/%d")
      p1 = create(:tray_plan,
                  facility_id: subject.id,
                  room_id: last_room.id,
                  row_id: last_row.id,
                  shelf_id: last_shelf.id,
                  tray_id: last_tray.id,
                  capacity: 2,
                  start_date: p1_start_date,
                  end_date: p1_end_date)

      query_cmd = QueryAvailableTrays.call(subject.id, start_date, end_date)

      # Validate
      target = query_cmd.result.detect { |t| t[:tray_id] == last_tray.id.to_bson_id }
      expect(target[:tray_capacity]).to eq 10
      expect(target[:planned_capacity]).to eq 0
      expect(target[:remaining_capacity]).to eq 10
    end
  end
end

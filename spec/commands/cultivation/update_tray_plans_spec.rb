require 'rails_helper'

RSpec.describe Cultivation::UpdateTrayPlans, type: :command do
  let!(:facility) do
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
  let!(:current_user) { create(:user, facilities: [facility.id]) }
  let!(:strain) { create(:facility_strain, facility: facility) }
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
  let(:start_date) { Time.zone.parse("01/01/2019").beginning_of_day }
  let(:plant1_id) { BSON::ObjectId.new }
  let(:plant2_id) { BSON::ObjectId.new }
  let!(:batch1) do
    create(:batch, :scheduled, facility: facility, start_date: start_date, quantity: 6,
            batch_source: 'clones_from_mother', facility_strain: strain)
  end
  let!(:batch1_tasks) do
    original_start = Time.zone.parse("01/01/2018").beginning_of_day
    t1  = create(:task, batch: batch1, name: "Clone", phase: "clone", indelible: "group", indent: 0,
                  duration: 8, start_date: original_start, end_date: original_start + 8.days)
    t11 = create(:task, batch: batch1, name: "Grow", phase: "clone", indelible: "staying", indent: 1,
                  duration: 8, start_date: original_start, end_date: original_start + 8.days)
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
  let(:batch1_plans) do
    quantity = 6
    [
      { id: "plant#1", phase: "clone", quantity: quantity, serialNo: "M001",
        trays: [
          { plant_id: plant1_id.to_s, room_id: clone_room.id.to_s, row_id: clone_row1.id.to_s, shelf_id: clone_shelf1.id.to_s,
            tray_id: clone_tray1.id.to_s, tray_capacity: 3, tray_code: clone_tray1.code.to_s },
          { plant_id: plant2_id.to_s, room_id: clone_room.id.to_s, row_id: clone_row1.id.to_s, shelf_id: clone_shelf1.id.to_s,
            tray_id: clone_tray2.id.to_s, tray_capacity: 3, tray_code: clone_tray2.code.to_s },
        ]
      },
      { id: "veg#1", phase: "veg", quantity: quantity,
        trays: [
          { room_id: veg_room.id.to_s, row_id: veg_row1.id.to_s, shelf_id: veg_shelf1.id.to_s,
            tray_id: veg_tray1.id.to_s, tray_capacity: quantity, tray_code: veg_tray1.code.to_s },
        ]
      },
      { id: "flower#1", phase: "flower", quantity: quantity,
        trays: [
          { room_id: flower_room.id.to_s, row_id: flower_row1.id.to_s, shelf_id: flower_shelf1.id.to_s,
            tray_id: flower_tray1.id.to_s, tray_capacity: quantity, tray_code: flower_tray1.code.to_s },
        ]
      },
      { id: "dry#1", phase: "dry", quantity: quantity,
        trays: [
          { room_id: dry_room.id.to_s, row_id: dry_row1.id.to_s, shelf_id: dry_shelf1.id.to_s,
            tray_id: dry_tray1.id.to_s, tray_capacity: quantity, tray_code: dry_tray1.code.to_s },
        ]
      },
      { id: "cure#1", phase: "cure", quantity: quantity,
        trays: [
          { room_id: cure_room.id.to_s, row_id: cure_row1.id.to_s, shelf_id: cure_shelf1.id.to_s,
            tray_id: cure_tray1.id.to_s, tray_capacity: quantity, tray_code: cure_tray1.code.to_s },
        ]
      },
    ]
  end
  before do
    # Prepare - Create a new booking that overlaps with default plan
    Cultivation::SaveTrayPlans.call(batch1.id, batch1_plans, 6)
  end

  it ".call should update existing TrayPlan booking dates", focus: true do
    cmd = Cultivation::UpdateTrayPlans.call(current_user, batch_id: batch1.id)

    updated1 = Cultivation::TrayPlan.where(batch_id: batch1.id, phase: "clone").first
    updated2 = Cultivation::TrayPlan.where(batch_id: batch1.id, phase: "veg").first

    expect(cmd.errors).to eq({})
    expect(cmd.success?).to be true
    expect(updated1.start_date).to eq batch1_tasks[1].start_date
    expect(updated2.start_date).to eq batch1_tasks[3].start_date
  end
end


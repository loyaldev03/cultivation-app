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
  # Clone Locations
  let(:clone_room) { facility.rooms.detect { |r| r.purpose == Constants::CONST_CLONE } }
  let(:clone_row1) { clone_room.rows.first }
  let(:clone_shelf1) { clone_row1.shelves.first }
  let(:clone_tray1) { clone_shelf1.trays.first }
  let(:clone_tray2) { clone_shelf1.trays.last }
  # Veg Locations
  let(:veg_room) { facility.rooms.detect { |r| r.purpose == Constants::CONST_VEG } }
  let(:veg_row1) { veg_room.rows.first }
  let(:veg_shelf1) { veg_row1.shelves.first }
  let(:veg_tray1) { veg_shelf1.trays.first }
  let(:veg_tray2) { veg_shelf1.trays.last }
  # Flower Locations
  let(:flower_room) { facility.rooms.detect { |r| r.purpose == Constants::CONST_FLOWER } }
  let(:flower_row1) { flower_room.rows.first }
  let(:flower_shelf1) { flower_row1.shelves.first }
  let(:flower_tray1) { flower_shelf1.trays.first }
  let(:flower_tray2) { flower_shelf1.trays.last }
  # Dry Locations
  let(:dry_room) { facility.rooms.detect { |r| r.purpose == Constants::CONST_DRY } }
  let(:dry_row1) { dry_room.rows.first }
  let(:dry_shelf1) { dry_row1.shelves.first }
  let(:dry_tray1) { dry_shelf1.trays.first }
  let(:dry_tray2) { dry_shelf1.trays.last }
  # Cure Locations
  let(:cure_room) { facility.rooms.detect { |r| r.purpose == Constants::CONST_CURE } }
  let(:cure_row1) { cure_room.rows.first }
  let(:cure_shelf1) { cure_row1.shelves.first }
  let(:cure_tray1) { cure_shelf1.trays.first }
  let(:cure_tray2) { cure_shelf1.trays.last }
  let(:start_date) { Time.zone.parse("01/01/2019").beginning_of_day }
  let(:plant1_id) { BSON::ObjectId.new }
  let(:plant2_id) { BSON::ObjectId.new }
  let!(:current_user) { create(:user, facilities: [facility.id]) }
  let!(:strain) { create(:facility_strain, facility: facility) }
  let!(:batch1) do
    create(:batch, :scheduled,
           facility: facility,
           facility_strain: strain,
           batch_source: 'clones_from_mother',
           quantity: 6,
           start_date: start_date)
  end
  let!(:batch1_tasks) do
    original_start = Time.zone.parse("01/01/2018").beginning_of_day
    t1  = create(:task, batch: batch1, name: "Clone", phase: Constants::CONST_CLONE,
                 indelible: Constants::INDELIBLE_GROUP, indent: 0,
                 duration: 8, start_date: original_start, end_date: original_start + 10.days)
    t11 = create(:task, batch: batch1, name: "Grow", phase: Constants::CONST_CLONE,
                 indelible: Constants::INDELIBLE_STAYING, indent: 1,
                 duration: 8, start_date: original_start, end_date: original_start + 8.days)
    t12 = create(:task, batch: batch1, name: "Cleaning", phase: Constants::CONST_CLONE,
                 indelible: Constants::INDELIBLE_CLEANING, indent: 1,
                 duration: 2, start_date: t11.end_date, end_date: t11.end_date + 2.days)
    t2  = create(:task, batch: batch1, name: "Veg", phase: Constants::CONST_VEG,
                 indelible: Constants::INDELIBLE_GROUP, indent: 0,
                 duration: 14, start_date: t1.end_date, end_date: t1.end_date + 16.days)
    t21 = create(:task, batch: batch1, name: "Grow", phase: Constants::CONST_VEG,
                 indelible: Constants::INDELIBLE_STAYING, indent: 1,
                 duration: 14, start_date: t1.end_date, end_date: t1.end_date + 14.days)
    t22 = create(:task, batch: batch1, name: "Cleaning", phase: Constants::CONST_VEG,
                 indelible: Constants::INDELIBLE_CLEANING, indent: 1,
                 duration: 2, start_date: t21.end_date, end_date: t21.end_date + 2.days)
    t3  = create(:task, batch: batch1, name: "Flower", phase: Constants::CONST_FLOWER,
                 indelible: Constants::INDELIBLE_GROUP, indent: 0,
                 duration: 56, start_date: t2.end_date, end_date: t2.end_date + 58.days)
    t31 = create(:task, batch: batch1, name: "Grow", phase: Constants::CONST_FLOWER,
                 indelible: Constants::INDELIBLE_STAYING, indent: 1,
                 duration: 56, start_date: t2.end_date, end_date: t2.end_date + 56.days)
    t32 = create(:task, batch: batch1, name: "Cleaning", phase: Constants::CONST_FLOWER,
                 indelible: Constants::INDELIBLE_CLEANING, indent: 1,
                 duration: 2, start_date: t31.end_date, end_date: t31.end_date + 2.days)
    t4  = create(:task, batch: batch1, name: "Harvest", phase: Constants::CONST_HARVEST,
                 indelible: Constants::INDELIBLE_GROUP, indent: 0,
                 duration: 2, start_date: t3.end_date, end_date: t3.end_date + 2.days)
    t5  = create(:task, batch: batch1, name: "Dry", phase: Constants::CONST_DRY,
                 indelible: Constants::INDELIBLE_GROUP, indent: 0,
                 duration: 7, start_date: t4.end_date, end_date: t4.end_date + 7.days)
    t51 = create(:task, batch: batch1, name: "Drying", phase: Constants::CONST_DRY,
                 indelible: Constants::INDELIBLE_STAYING, indent: 1,
                 duration: 7, start_date: t4.end_date, end_date: t4.end_date + 7.days)
    t6  = create(:task, batch: batch1, name: "Trim", phase: Constants::CONST_TRIM,
                 indelible: Constants::INDELIBLE_GROUP, indent: 0,
                 duration: 2, start_date: t5.end_date, end_date: t5.end_date + 2.days)
    t7  = create(:task, batch: batch1, name: "Cure", phase: Constants::CONST_CURE,
                 indelible: Constants::INDELIBLE_GROUP, indent: 0,
                 duration: 5, start_date: t6.end_date, end_date: t6.end_date + 5.days)
    t71 = create(:task, batch: batch1, name: "Curing", phase: Constants::CONST_CURE,
                 indelible: Constants::INDELIBLE_STAYING, indent: 1,
                 duration: 5, start_date: t6.end_date, end_date: t6.end_date + 5.days)
    [
      t1, t11, t12,
      t2, t21, t22,
      t3, t31, t32,
      t4,
      t5, t51,
      t6,
      t7, t71
    ]
  end
  let(:batch1_plans) do
    quantity = 6
    [
      {id: BSON::ObjectId.new, phase: Constants::CONST_CLONE, quantity: quantity,
       serialNo: "M001",
       trays: [
         {plant_id: plant1_id.to_s, room_id: clone_room.id.to_s,
          row_id: clone_row1.id.to_s, shelf_id: clone_shelf1.id.to_s,
          tray_id: clone_tray1.id.to_s, tray_capacity: 3,
          tray_code: clone_tray1.code.to_s},
         {plant_id: plant2_id.to_s, room_id: clone_room.id.to_s,
          row_id: clone_row1.id.to_s, shelf_id: clone_shelf1.id.to_s,
          tray_id: clone_tray2.id.to_s, tray_capacity: 3,
          tray_code: clone_tray2.code.to_s},
       ]
      },
      {id: BSON::ObjectId.new, phase: Constants::CONST_VEG, quantity: quantity,
       trays: [
         {room_id: veg_room.id.to_s, row_id: veg_row1.id.to_s,
          shelf_id: veg_shelf1.id.to_s,
          tray_id: veg_tray1.id.to_s, tray_capacity: quantity,
          tray_code: veg_tray1.code.to_s},
       ]
      },
      {id: BSON::ObjectId.new, phase: Constants::CONST_FLOWER, quantity: quantity,
       trays: [
         {room_id: flower_room.id.to_s, row_id: flower_row1.id.to_s,
          shelf_id: flower_shelf1.id.to_s,
          tray_id: flower_tray1.id.to_s, tray_capacity: quantity,
          tray_code: flower_tray1.code.to_s},
       ]
      },
      {id: BSON::ObjectId.new, phase: Constants::CONST_DRY, quantity: quantity,
       trays: [
         {room_id: dry_room.id.to_s, row_id: dry_row1.id.to_s,
          shelf_id: dry_shelf1.id.to_s,
          tray_id: dry_tray1.id.to_s, tray_capacity: quantity,
          tray_code: dry_tray1.code.to_s},
       ]
      },
      {id: BSON::ObjectId.new, phase: Constants::CONST_CURE, quantity: quantity,
       trays: [
         {room_id: cure_room.id.to_s, row_id: cure_row1.id.to_s,
          shelf_id: cure_shelf1.id.to_s,
          tray_id: cure_tray1.id.to_s, tray_capacity: quantity,
          tray_code: cure_tray1.code.to_s},
       ]
      },
    ]
  end

  before do
    # Prepare - Create a new booking that overlaps with default plan
    Cultivation::SaveTrayPlans.call(batch1.id, batch1_plans, 6)
  end

  it "tray plans should start on grow period start_date" do
    cmd = Cultivation::UpdateTrayPlans.call(current_user, batch_id: batch1.id)

    booking_clone = Cultivation::TrayPlan.
      where(batch_id: batch1.id, phase: Constants::CONST_CLONE).first
    booking_veg = Cultivation::TrayPlan.
      where(batch_id: batch1.id, phase: Constants::CONST_VEG).first
    booking_flower = Cultivation::TrayPlan.
      where(batch_id: batch1.id, phase: Constants::CONST_FLOWER).first

    clone_grow_period = batch1_tasks[1]
    veg_grow_period = batch1_tasks[4]
    flower_grow_period = batch1_tasks[7]

    expect(cmd.errors).to eq({})
    expect(cmd.success?).to be true
    expect(booking_clone.start_date).to eq clone_grow_period.start_date
    expect(booking_veg.start_date).to eq veg_grow_period.start_date
    expect(booking_flower.start_date).to eq flower_grow_period.start_date
  end

  it "tray plans should end on cleaning end_date" do
    cmd = Cultivation::UpdateTrayPlans.call(current_user, batch_id: batch1.id)

    booking_clone = Cultivation::TrayPlan.
      where(batch_id: batch1.id, phase: Constants::CONST_CLONE).first
    booking_veg = Cultivation::TrayPlan.
      where(batch_id: batch1.id, phase: Constants::CONST_VEG).first
    booking_flower = Cultivation::TrayPlan.
      where(batch_id: batch1.id, phase: Constants::CONST_FLOWER).first

    clone_clean_period = batch1_tasks[2]
    veg_clean_period = batch1_tasks[5]
    flower_clean_period = batch1_tasks[8]

    expect(cmd.errors).to eq({})
    expect(cmd.success?).to be true
    expect(booking_clone.end_date).to eq clone_clean_period.end_date
    expect(booking_flower.end_date).to eq flower_clean_period.end_date
    expect(booking_veg.end_date).to eq veg_clean_period.end_date
  end
end


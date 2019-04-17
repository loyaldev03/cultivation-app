require 'rails_helper'

RSpec.describe Cultivation::SaveTrayPlans, type: :command do
  before do
    Time.zone = "UTC"
  end
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
  let(:current_user) { create(:user, facilities: [facility.id]) }
  let(:strain) { create(:facility_strain, facility: facility) }
  let(:batch) do
    start_date = Time.zone.parse("01/01/2019").beginning_of_day
    create(:batch, :scheduled,
           facility_id: facility.id,
           facility_strain: strain,
           start_date: start_date,
           quantity: 10,
           batch_source: 'clones_from_mother')
  end

  let!(:tasks) do
    # wbs: 1
    d1 = Faker::Number.number(2).to_i
    t1 = create(:task, batch: batch, name: "Clone", phase: "clone", indelible: "group", indent: 0,
                duration: d1, start_date: batch.start_date, end_date: batch.start_date + d1.days)
    t11 = create(:task, batch: batch, name: "Grow", phase: "clone", indelible: "staying", indent: 1,
                 duration: d1, start_date: t1.start_date, end_date: t1.start_date + d1.days)
    # wbs: 2
    d2 = Faker::Number.number(2).to_i
    t2 = create(:task, batch: batch, name: "Veg 1", phase: "veg1", indelible: "group", indent: 0,
                duration: d2, start_date: t1.end_date, end_date: t1.end_date + d2.days)
    t21 = create(:task, batch: batch, name: "Grow",phase: "veg1", indelible: "staying", indent: 1,
                 duration: d2, start_date: t2.start_date, end_date: t2.start_date + d2.days)
    # wbs: 3
    d3 = Faker::Number.number(2).to_i
    t3 = create(:task, batch: batch, name: "Veg 2", phase: "veg2", indelible: "group", indent: 0,
                duration: d3, start_date: t2.end_date, end_date: t2.end_date + d3.days)
    t31 = create(:task, batch: batch, name: "Grow", phase: "veg2", indelible: "staying", indent: 1,
                 duration: d3, start_date: t3.end_date, end_date: t3.end_date + d3.days)
    [t1,
     t11,
     t2,
     t21,
     t3,
     t31]
  end

  let(:clone_room) { facility.rooms.detect { |r| r.purpose == "clone" } }
  let(:clone_row1) { clone_room.rows.first }
  let(:clone_shelf1) { clone_row1.shelves.first }
  let(:clone_tray1) { clone_shelf1.trays.first }
  let(:clone_tray2) { clone_shelf1.trays.last }
  let(:plant1_id) { BSON::ObjectId.new }
  let(:plant2_id) { BSON::ObjectId.new }

  context ".call with duplicate tray plan" do
    let(:plans) do
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
              tray_capacity: 3,
              tray_code: clone_tray1.code.to_s,
              tray_id: clone_tray1.id.to_s,
            },
            {
              plant_id: plant2_id.to_s,
              room_id: clone_room.id.to_s,
              row_id: clone_row1.id.to_s,
              shelf_id: clone_shelf1.id.to_s,
              tray_capacity: 3,
              tray_code: clone_tray1.code.to_s,
              tray_id: clone_tray1.id.to_s,
            },
          ],
        },
      ]
    end

    it "should save as 1 single record" do
      cmd = Cultivation::SaveTrayPlans.call(batch.id, plans, 6)
      query = QueryAvailableCapacity.call(facility_id: facility.id,
                                          start_date: tasks[1].start_date,
                                          end_date: tasks[1].end_date,
                                          purpose: "clone")

      expect(query.result).to eq 74

      # Validate Tray Plans
      tray_plans = Cultivation::TrayPlan.where(batch_id: batch.id)
      expect(cmd.success?).to be true
      expect(cmd.result.quantity).to be 6
      expect(tray_plans.count).to eq 1
      # Validate Saved Tray
      expect(tray_plans[0]).to have_attributes(
        facility_id: facility.id,
        batch_id: batch.id,
        room_id: clone_room.id,
        row_id: clone_row1.id,
        shelf_id: clone_shelf1.id,
        tray_id: clone_tray1.id,
        capacity: 6,
        phase: "clone",
        start_date: tasks[1].start_date,
        end_date: tasks[1].end_date,
      )
    end

    it "should allow exclude after save" do
      cmd = Cultivation::SaveTrayPlans.call(batch.id, plans, 10)
      query = QueryAvailableCapacity.call(facility_id: facility.id,
                                          start_date: tasks[1].start_date,
                                          end_date: tasks[1].end_date,
                                          exclude_batch_id: batch.id,
                                          purpose: "clone")
      expect(cmd.success?).to be true
      expect(query.result).to eq 80
    end

    it "should delete previous plans" do
      Cultivation::SaveTrayPlans.call(batch.id, plans, 6)
      Cultivation::SaveTrayPlans.call(batch.id, plans, 6)

      query = QueryAvailableCapacity.call(facility_id: facility.id,
                                          start_date: tasks[1].start_date,
                                          end_date: tasks[1].end_date,
                                          purpose: "clone")
      expect(query.result).to eq 74
    end
  end

  context ".call with 2 plans" do
    let(:plans) do
      [
        {
          id: "plant#1",
          phase: "clone",
          quantity: 10,
          serialNo: "M001",
          trays: [
            {
              plant_id: plant1_id.to_s,
              room_id: clone_room.id.to_s,
              row_id: clone_row1.id.to_s,
              shelf_id: clone_shelf1.id.to_s,
              tray_capacity: 5,
              tray_code: clone_tray1.code.to_s,
              tray_id: clone_tray1.id.to_s,
            },
            {
              plant_id: plant2_id.to_s,
              room_id: clone_room.id.to_s,
              row_id: clone_row1.id.to_s,
              shelf_id: clone_shelf1.id.to_s,
              tray_capacity: 5,
              tray_code: clone_tray2.code.to_s,
              tray_id: clone_tray2.id.to_s,
            },
          ],
        },
      ]
    end

    it "save tray plans with all ids" do
      cmd = Cultivation::SaveTrayPlans.call(batch.id, plans, 10)

      # Validate Tray Plans
      tray_plans = Cultivation::TrayPlan.where(batch_id: batch.id)
      t11 = tasks[1]
      expect(cmd.success?).to be true
      expect(tray_plans.count).to be 2

      # Validate Tray#1
      expect(tray_plans[0].facility_id).to eq facility.id
      expect(tray_plans[0].batch_id).to eq batch.id
      expect(tray_plans[0].room_id).to eq clone_room.id
      expect(tray_plans[0].row_id).to eq clone_row1.id
      expect(tray_plans[0].shelf_id).to eq clone_shelf1.id
      expect(tray_plans[0].tray_id).to eq clone_tray1.id
      expect(tray_plans[0].capacity).to eq 5
      expect(tray_plans[0].phase).to eq "clone"
      expect(tray_plans[0].start_date).to eq t11.start_date
      expect(tray_plans[0].end_date).to eq t11.end_date

      # Validate Tray#2
      expect(tray_plans[1].start_date).to eq t11.start_date
      expect(tray_plans[1].end_date).to eq t11.end_date
      expect(tray_plans[1].capacity).to eq 5
      expect(tray_plans[1].phase).to eq "clone"
    end

    it "Query Trays after Save Tray Plans" do
      t11 = tasks[1]

      cmd = Cultivation::SaveTrayPlans.call(batch.id, plans, 10)
      query = QueryAvailableTrays.call(start_date: t11.start_date,
                                       end_date: t11.end_date,
                                       facility_id: facility.id,
                                       purpose: ["clone"])

      expect(cmd.success?).to be true
      expect(query.success?).to be true
      expect(query.result.count).to be 8
    end

    it "Query Capacity after Save Tray Plans" do
      t11 = tasks[1]
      cmd = Cultivation::SaveTrayPlans.call(batch.id, plans, 10)

      query = QueryAvailableCapacity.call(facility_id: facility.id,
                                          start_date: t11.start_date,
                                          end_date: t11.end_date,
                                          purpose: "clone")

      expect(cmd.success?).to be true
      expect(query.success?).to be true
      expect(query.result).to be 70
    end
  end
end

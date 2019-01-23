require 'rails_helper'

RSpec.describe UpdateActiveTrayPlansJob, type: :job do
  include ActiveJob::TestHelper

  let(:current_user) { create(:user) }
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
  let(:clone_room) do
    facility.rooms.detect do |r|
      r.purpose == Constants::CONST_CLONE
    end
  end
  let(:first_row) { clone_room.rows.first }
  let(:clone_tray) do
    first_shelf = first_row.shelves.first
    first_shelf.trays.last
  end
  let(:clone_tray2) do
    first_shelf = first_row.shelves.first
    first_shelf.trays.first
  end
  let(:facility_strain) { build(:facility_strain) }
  let(:batch) do
    create(:batch,
            facility_id: facility.id,
            facility_strain: facility_strain,
            start_date: Time.strptime("2018/08/01", DATE_FORMAT),
            quantity: 5)
  end
  let!(:phase_task) do
    # Use ! to create the task immeadiately
    # Create a "Phase" task do set start_date & end_date of a phase.
    # The job will need to access the dates for it to create the
    # tray booking record.
    create(:task,
            batch: batch,
            phase: Constants::CONST_CLONE,
            duration: 16,
            start_date: batch.start_date,
            end_date: batch.start_date + 16.days)
  end

  context ".perform" do
    after(:each) do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    let(:job_params) { batch.id.to_s }
    let(:job) { described_class.perform_later(job_params) }

    it "should queues the job" do
      expect { job }.to have_enqueued_job(described_class).
        with(job_params).
        on_queue("default")
    end

    it "should create TrayPlan if not exists" do
      # Prepare - Add new active clone to tray
      total_capacity = 80 # Total Capacty of Clone Room (2x2x2x10)
      plant_count = rand(1..total_capacity)
      plant_count.times do |i|
        # Simulate plants added into two different tray
        location_id = i % 2 == 0 ? clone_tray.id : clone_tray2.id
        create(:plant, :clone,
                        cultivation_batch: batch,
                        location_id: location_id,
                        facility_strain: facility_strain)
      end

      # Execute
      perform_enqueued_jobs { job }

      # Validate
      plan_info = {
        facility_id: facility.id,
        phase: Constants::CONST_CLONE,
        start_date: phase_task.start_date,
        end_date: phase_task.end_date,
      }

      cmd_result = QueryAvailableCapacity.call(plan_info).result
      expect(cmd_result).to eq(total_capacity - plant_count)
    end

    it "should re-create TrayPlan(s) if exists" do
      # Prepare - Add an existing TrayPlan
      existing_count = 10
      create(:tray_plan,
              facility_id: facility.id,
              batch: batch,
              room_id: clone_room.id,
              row_id: first_row.id,
              shelf_id: clone_tray.shelf_id,
              tray_id: clone_tray.id,
              capacity: existing_count,
              phase: Constants::CONST_CLONE,
              start_date: Time.strptime("2018/08/01", DATE_FORMAT),
              end_date: Time.strptime("2018/08/17", DATE_FORMAT))

      total_capacity = 80
      plant_count = rand(1..total_capacity)
      plant_count.times do |i|
        location_id = i % 2 == 0 ? clone_tray.id : clone_tray2.id
        create(:plant, :clone,
                        cultivation_batch: batch,
                        location_id: location_id,
                        facility_strain: facility_strain)
      end

      # Execute
      perform_enqueued_jobs { job }

      # Validate
      plan_info = {
        facility_id: facility.id,
        phase: Constants::CONST_CLONE,
        start_date: phase_task.start_date,
        end_date: phase_task.end_date,
      }

      # plans_count = Cultivation::TrayPlan.where(batch_id: batch.id).count
      # p "Total TrayPlan created: #{plans_count}"

      cmd_result = QueryAvailableCapacity.call(plan_info).result
      expect(cmd_result).to eq(total_capacity - plant_count)
      batch_updated = Cultivation::Batch.find(batch.id)
      expect(batch_updated.quantity).to eq(plant_count)
      expect(batch_updated.current_growth_stage).to eq(Constants::CONST_CLONE)
    end
  end
end

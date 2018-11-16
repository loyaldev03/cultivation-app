require 'rails_helper'

RSpec.describe UpdateTrayPlansJob, type: :job do
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
    create(:task, :is_phase,
            batch: batch,
            phase: Constants::CONST_CLONE,
            duration: 16,
            start_date: batch.start_date,
            end_date: batch.start_date + 16.days)
  end

  context "when there's no existing TrayPlan" do
    let(:job_params) { batch.id.to_s }

    subject(:job) do
      described_class.perform_later(job_params)
    end

    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    it "queues the job" do
      expect { job }.to have_enqueued_job(described_class).
        with(job_params).
        on_queue("default")
    end

    it "executes perform", focus: true do
      # Prepare - Add new active clone to tray
      create(:plant, :clone,
                     cultivation_batch: batch,
                     location_id: clone_tray.id,
                     facility_strain: facility_strain)
      create(:plant, :clone,
                     cultivation_batch: batch,
                     location_id: clone_tray.id,
                     facility_strain: facility_strain)
      create(:plant, :clone,
                     cultivation_batch: batch,
                     location_id: clone_tray2.id,
                     facility_strain: facility_strain)

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
      expect(cmd_result).to eq(77)
    end
  end

  context "when there's already an existing TrayPlan" do
    # let(:default_plan) do
    #   # Create a Tray booking record in the db. The other tests
    #   # would test against this plan.
    #   p1 = create(:tray_plan,
    #               facility_id: facility.id,
    #               batch: batch,
    #               room_id: clone_room.id,
    #               row_id: first_row.id,
    #               shelf_id: clone_tray.shelf_id,
    #               tray_id: clone_tray.id,
    #               capacity: 5,
    #               phase: Constants::CONST_CLONE,
    #               start_date: Time.strptime("2018/08/01", DATE_FORMAT),
    #               end_date: Time.strptime("2018/08/17", DATE_FORMAT))
    #   p1
    # end
  end
end

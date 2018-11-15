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

  context "after batch updated" do
    let(:facility_strain) { build(:facility_strain) }
    let(:batch) do
      create(:batch,
              facility_id: facility.id,
              facility_strain: facility_strain,
              start_date: Time.strptime("2018/08/01", DATE_FORMAT),
              quantity: 5)
      # TODO: I need to create the "Phase" task also, since that is
      # where the start_date & end_date is stored.
      # The job will need to access the dates for it to create the
      # booking record correctly.
    end

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

    let(:job_params) do
      {
        batch_id: batch.id.to_s,
      }
    end

    let(:job) do
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

    it "executes perform" do
      # Prepare
      # TODO: Add an new active plant to tray
      active_plant = create(:plant, :clone,
                            cultivation_batch: batch,
                            location_id: clone_tray.id,
                            facility_strain: facility_strain)

      phase_start_date = Time.strptime("2018/08/01", DATE_FORMAT)
      phase_end_date = Time.strptime("2018/08/17", DATE_FORMAT)

      # Execute
      job

      # Validate
      plan_info = {
        facility_id: facility.id,
        phase: Constants::CONST_CLONE,
        start_date: phase_start_date,
        end_date: phase_end_date,
      }
      cmd_result = QueryAvailableCapacity.call(plan_info).result
      expect(cmd_result).to eq(70)
    end
  end
end

require "rails_helper"

RSpec.describe CalculateTotalActualCostBatchJob, type: :job do
  include ActiveJob::TestHelper

  let(:strain) { Common::Strain.create!(name: 'xyz', strain_type: 'indica') }
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

  let!(:facility_strain) {
    create(:facility_strain, facility: facility)
  }

  let(:current_user) { create(:user, facilities: [facility.id]) }
  let!(:batch1) do
    start_date = Time.zone.parse("01/01/2019").beginning_of_day
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: Constants::SEEDS_KEY)
  end

  let!(:valid_user) { User.create!(email: 'email@email.com', password: 'password', password_confirmation: 'password', hourly_rate: 5, overtime_hourly_rate: 7) }

  context ".perform" do
    after(:each) do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    let(:job_params) { batch1.id.to_s }
    let(:job) { described_class.perform_later(job_params) }

    it "should queues the job" do
      expect { job }.to have_enqueued_job(described_class).
        with(job_params).
        on_queue("low")
    end

    it "should return correct sum value for actual_cost and actual_hours" do
      start_time = Time.zone.local(2019, 4, 21, 8,00)
      end_time = Time.zone.local(2019, 4, 21, 18, 00)
      task = Cultivation::Task.create(batch: batch1)
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)

      Cultivation::CalculateTaskActualCostAndHours.call_by_id(time_log.id.to_s, valid_user, true)
      CalculateTotalActualCostJob.perform_now(task.id.to_s)
      perform_enqueued_jobs { job }

      batch = Cultivation::Batch.find(batch1.id.to_s)

      expect(batch.actual_cost).to eq(50)
      expect(batch.actual_hours).to eq(10)
    end
  end
end

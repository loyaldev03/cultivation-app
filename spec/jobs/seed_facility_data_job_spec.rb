require "rails_helper"

RSpec.describe SeedFacilityDataJob, type: :job do
  include ActiveJob::TestHelper

  after do
    clear_enqueued_jobs
    clear_performed_jobs
  end

  let(:current_user) { create(:user) }
  let(:params) do
    {
      facility_id: BSON::ObjectId.new.to_s,
      current_user_id: current_user.id.to_s,
    }
  end
  let(:job) do
    described_class.perform_later(params)
  end

  it "queues the job" do
    expect { job }.to have_enqueued_job(described_class).
      with(params).
      on_queue("default")
  end

  it "executes perform" do
    perform_enqueued_jobs do
      job

      expect(Common::Role.where(built_in: true).count).to eq 1
    end
  end
end

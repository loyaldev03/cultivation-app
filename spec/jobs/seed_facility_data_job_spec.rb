require 'rails_helper'

RSpec.describe SeedFacilityDataJob, type: :job do
  include ActiveJob::TestHelper

  after do
    clear_enqueued_jobs
    clear_performed_jobs
  end

  subject(:job) { described_class.perform_later(facility_id) }

  let(:facility_id) { (BSON::ObjectId.new).to_s }

  it 'queues the job' do
    expect { job }.to have_enqueued_job(described_class)
      .with(facility_id)
      .on_queue("default")
  end

  it 'executes perform' do
    perform_enqueued_jobs do
      job

      expect(Common::Role.where(built_in: true).count).to eq 1
    end
  end
end

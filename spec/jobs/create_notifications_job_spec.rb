require "rails_helper"

RSpec.describe CreateNotificationsJob, type: :job do
  include ActiveJob::TestHelper

  let(:actor) { create(:user) }
  let(:recipient1) { create(:user) }
  let(:recipient2) { create(:user) }
  let(:task) { create(:task) }

  context ".perform" do
    after(:each) do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    let(:job_params) do
      {
        actor_id: actor.id.to_s,
        action: "assign",
        recipients: [recipient1.id.to_s, recipient2.id.to_s],
        notifiable_id: task.id.to_s,
        notifiable_type: Constants::NOTIFY_TYPE_TASK,
        notifiable_name: task.name,
      }
    end
    let(:job) { described_class.perform_later(job_params) }

    it "should queues the job" do
      expect { job }.to have_enqueued_job(described_class).
        with(job_params).
        on_queue("low")
    end

    it "should notification records" do
      # Execute
      perform_enqueued_jobs { job }

      # Validate
      expect(Notification.count).to eq 2
      first = Notification.first
      last = Notification.last
      expect(first).to have_attributes(
        recipient_id: recipient1.id,
        recipient_name: recipient1.display_name,
        actor_id: actor.id,
        actor_name: actor.display_name,
        action: "assign",
        notifiable_id: task.id,
        notifiable_type: Constants::NOTIFY_TYPE_TASK,
        notifiable_name: task.name,
      )
      expect(last).to have_attributes(
        recipient_id: recipient2.id,
        recipient_name: recipient2.display_name,
        actor_id: actor.id,
        actor_name: actor.display_name,
        action: "assign",
        notifiable_id: task.id,
        notifiable_type: Constants::NOTIFY_TYPE_TASK,
        notifiable_name: task.name,
      )
    end
  end
end


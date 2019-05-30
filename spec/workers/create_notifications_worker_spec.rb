require "rails_helper"
require "sidekiq/testing"

RSpec.describe CreateNotificationsWorker, type: :job do
  let(:actor) { create(:user) }
  let(:recipient1) { create(:user) }
  let(:recipient2) { create(:user) }
  let(:task) { create(:task) }

  context ".perform" do
    let(:job) { described_class.new }

    it "should enqueue worker" do
      expect {
        described_class.perform_async(
          actor.id.to_s,
          "assign",
          [recipient1.id.to_s, recipient2.id.to_s],
          task.id.to_s,
          Constants::NOTIFY_TYPE_TASK,
          task.name,
        )
      }.to change(described_class.jobs, :size).by(1)
    end

    it "should notification records" do
      # Execute
      job.perform(
        actor.id.to_s,
        "assign",
        [recipient1.id.to_s, recipient2.id.to_s],
        task.id.to_s,
        Constants::NOTIFY_TYPE_TASK,
        task.name,
      )

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

    it "should notify as system" do
      # Execute
      job.perform(
        nil,
        "batch_reminder",
        [recipient1.id.to_s, recipient2.id.to_s],
        task.id.to_s,
        Constants::NOTIFY_TYPE_BATCH,
        task.name,
      )

      # Validate
      expect(Notification.count).to eq 2
      first = Notification.first
      last = Notification.last
      expect(first).to have_attributes(
        recipient_id: recipient1.id,
        recipient_name: recipient1.display_name,
        actor_name: "System",
        action: "batch_reminder",
      )
      expect(last).to have_attributes(
        recipient_id: recipient2.id,
        recipient_name: recipient2.display_name,
        actor_name: "System",
        action: "batch_reminder",
      )
    end
  end
end

# Warning this is only used for local/ development purpose only,
# where it assumes only one facility and at least one user already exist.
module Issues
  class SeedDummyIssue
    prepend SimpleCommand

    def call
      user = User.last
      batch = Cultivation::Batch.last

      Issues::Issue.create!(
        issue_no: Issues::Issue.count + 1,
        title: 'Missing 25 clone kits',
        description: 'Unable to start cultivation batch',
        cultivation_batch: batch,
        severity: 'severe',
        status: 'open',
        issue_type: 'planning',
        reported_by: user,
      )

      location_id = batch.tray_plans.empty? ? nil : batch.tray_plans.first.room_id
      location_type = batch.tray_plans.empty? ? nil : 'Room'

      Issues::Issue.create!(
        issue_no: Issues::Issue.count + 1,
        title: 'Suspected mold',
        description: 'Plant XYZ1, XYZ2 seems to have mold',
        cultivation_batch: batch,
        task: batch.tasks[3],
        severity: 'severe',
        status: 'open',
        issue_type: 'daily_task',
        reported_by: user,
        location_id: location_id,
        location_type: location_type,
      )
    end
  end
end

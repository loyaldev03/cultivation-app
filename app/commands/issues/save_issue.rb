module Issues
  class SaveIssue
    prepend SimpleCommand

    attr_reader :id,
                :title,
                :description,
                :severity,
                :issue_type,
                :task,
                :location_id,
                :location_type,
                :cultivation_batch,
                :assigned_to,
                :attachments,
                :user,
                :tags,
                :args

    def initialize(user, args)
      @user = user
      @args = args

      @id = args[:id]
      @title = args[:title]
      @description = args[:description]
      @severity = args[:severity]

      @issue_type = args[:issue_type]
      @location_id = args[:location_id]
      @location_type = args[:location_type]
      @resolution_notes = args[:resolution_notes]
      @reason = args[:reason]
      @resolved_at = args[:resolved_at]

      @cultivation_batch = Cultivation::Batch.find(args[:cultivation_batch_id])
      @task = Cultivation::Task.find(args[:task_id])
      @assigned_to = User.find(args[:assigned_to_id])

      @attachments = args[:attachments]
      @tags = args[:tags]
    end

    def call
      return if !valid_permission? && !valid_data?

      if id.blank?
        create_issue
      else
        update_issue
      end
    end

    private

    def valid_permission?
      true
    end

    def valid_data?
      ## TODO: Do validation here,
      # 1. issue requires title, issue type, reported by
      # 2. location id should be same facility as the batch
      true
    end

    def create_issue
      issue = Issues::Issue.create!(
        issue_no: Issues::Issue.count + 1,
        title: title,
        description: description,
        cultivation_batch: cultivation_batch,
        severity: severity,
        status: 'open',
        issue_type: issue_type || 'daily_task',
        location_id: location_id,
        location_type: location_type,
        reported_by: user,
        assigned_to: assigned_to,
        task: task,
        tags: tags,
      )
      update_attachments(issue, args)
      issue
    end

    def update_issue
      issue = Issues::Issue.find(id)
      issue.update!(
        title: title,
        description: description,
        severity: severity,
        location_id: location_id,
        location_type: location_type,
        assigned_to: assigned_to,
        task: task,
        tags: tags,
      )
      update_attachments(issue, args)
      issue
    end

    # TODO: Not complete yet, debug!
    def update_attachments(issue, args)
      if issue.persisted?
        delete_ids = args[:delete_attachments]
        issue.attachments.in(id: delete_ids).update_all(deleted: true)
      end

      attachments.each do |attachment|
        if attachment[:id].blank?
          new_file = issue.attachments.build
          new_file.file = attachment[:data] # <json string>
          new_file.save!
        end
      end
    end
  end
end

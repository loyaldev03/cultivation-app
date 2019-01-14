module Issues
  class IssueSerializer
    include FastJsonapi::ObjectSerializer

    attributes :issue_no, :title, :description, :severity,
               :status, :issue_type, :location_type,
               :resolution_notes, :reason

    attribute :id do |object|
      object.id.to_s
    end

    attribute :task do |object|
      if object.task.present?
        {
          id: object.task.id.to_s,
          name: object.task.name,
        }
      else
        nil
      end
    end

    attribute :location_id do |object|
      object.location_id.to_s
    end

    attribute :attachments do |object|
      nil
    end

    attribute :comments do |object|
      nil
    end

    attribute :cultivation_batch do |object|
      {
        id: object.cultivation_batch.id.to_s,
        batch_no: object.cultivation_batch.batch_no,
        name: object.cultivation_batch.name,
      }
    end

    attribute :reported_by do |object|
      {
        id: object.reported_by_id.to_s,
        display_name: object.reported_by.display_name,
        photo: object.reported_by.photo&.url,
        first_name: object.reported_by.first_name,
        last_name: object.reported_by.last_name,
      }
    end

    attribute :assigned_to do |object|
      if object.assigned_to.present?
        {
          id: object.assigned_to_id.to_s,
          display_name: object.assigned_to.display_name,
          photo: object.assigned_to.photo&.url,
          first_name: object.assigned_to.first_name,
          last_name: object.assigned_to.last_name,
        }
      else
        nil
      end
    end

    attribute :resolved_at do |object|
      object.resolved_at.iso8601 if object.resolved_at.present?
    end

    attribute :resolved_by do |object|
      if object.resolved_by.present?
        {
          id: object.resolved_by_id.to_s,
          display_name: object.resolved_by.display_name,
          photo: object.resolved_by.photo.url,
          first_name: object.resolved_by.first_name,
          last_name: object.resolved_by.last_name,
        }
      else
        nil
      end
    end

    attribute :created_at do |object|
      object.c_at.iso8601
    end
  end
end

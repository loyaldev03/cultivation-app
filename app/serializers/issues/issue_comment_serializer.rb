module Issues
  class IssueCommentSerializer
    include FastJsonapi::ObjectSerializer
    attributes :message, :quote, :resolved

    attribute :id do |object|
      object.id.to_s
    end

    attribute :sender do |object|
      {
        first_name: object.created_by.first_name,
        last_name: object.created_by.last_name,
        photo: object.created_by.photo&.url,
      }
    end

    attribute :sent_at do |object|
      object.created_at.iso8601
    end

    attribute :is_me do |object, params|
      object.created_by.id.to_s == params[:current_user_id]
    end

    attribute :task do |object|
      if object.task_id.blank?
        nil
      else
        task = Cultivation::Task.find(object.task.id)
        {
          name: task.name,
          url: '',
        }
      end
    end

    attribute :attachments do |object|
      object.comment_attachments.map do |x|
        {
          url: x.file.url,
          preview: x.file.url, # TODO: need a resizer...
          type: x.file_mime_type,
        }
      end
    end
  end
end

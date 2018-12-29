module Issues
  class Comment
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :message, type: String
    field :quote, type: String
    field :task_id, type: BSON::ObjectId                  # For issue/ comment that is converted to a task
    field :resolved, type: Boolean, default: false
    belongs_to :created_by, class_name: 'User'

    embedded_in :issue, class_name: 'Issues::Issue'
    embeds_many :comment_attachments, class_name: 'Issues::CommentAttachment'
  end
end

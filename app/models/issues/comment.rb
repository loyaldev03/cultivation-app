module Issues
  class Comment
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :message, type: String
    field :quote, type: String
    field :task_id, BSON::ObjectId
    field :resolved, type: Boolean, default: false
    belongs_to :created_by, class_name: 'User'

    embedded_in :issue, class_name: 'Issues::Issue'
    embeds_many :comment_attachments, class_name: 'Issues::CommentAttachment'
  end
end

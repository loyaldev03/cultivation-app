module Issues
  class Issue
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :issue_no, type: Integer
    field :title, type: String
    field :description, type: String
    field :severity, type: String       # { severe, normal }
    field :status, type: String         # { open, resolved }
    field :is_archived, type: Boolean, default: false
    field :issue_type, type: String     # { planning, daily_task }
    field :location_id, type: BSON::ObjectId
    field :location_type, type: String  # full ruby class name
    field :followers, type: Array, default: []

    embeds_many :attachments, class_name: 'Issues::Attachment'
    embeds_many :comments, class_name: 'Issues::Comment'

    belongs_to :task, class_name: 'Cultivation::Task', optional: true
    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch'
    belongs_to :reported_by, class_name: 'User'
    belongs_to :assigned_to, class_name: 'User', optional: true

    # For resolution
    field :resolution_notes, type: String
    field :reason, type: String
    field :resolved_at, type: DateTime
    belongs_to :resolved_by, class_name: 'User', optional: true
  end
end

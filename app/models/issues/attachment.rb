module Issues
  class Attachment
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include IssueAttachmentUploader::Attachment.new(:file)

    embedded_in :issue, class_name: 'Issues::Issue'
    field :file_data, type: String  # To be use by shrine to store attachment info
    field :file_size, type: Integer
    field :file_filename, type: String
    field :file_mime_type, type: String
    field :deleted, type: Boolean, default: -> { false }

    scope :deleted, -> { where(deleted: true) }
    scope :active, -> { where(deleted: false) }
  end
end

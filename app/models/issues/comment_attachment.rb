module Issues
  class CommentAttachment
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    include IssueAttachmentUploader::Attachment.new(:file)
    embedded_in :comment, class_name: 'Issues::Comment'
    field :file_data, type: String  # To be use by shrine to store attachment info
  end
end

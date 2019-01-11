module Issues
  class Attachment
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include IssueAttachmentUploader::Attachment.new(:file)

    embedded_in :issue, class_name: 'Issues::Issue'
    field :file_data, type: String  # To be use by shrine to store attachment info
  end
end

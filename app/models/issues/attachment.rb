module Issues
  class Attachment
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include IssueAttachmentUploader::Attachment.new(:file)

    embedded_in :issue, class_name: 'Issues::Issue'
  end
end

class FileAttachment
  include Mongoid::Document
  include Mongoid::Timestamps::Short
  include FileAttachmentUploader::Attachment.new(:file)

  field :file_data, type: String
  field :file_size, type: Integer
  field :file_filename, type: String
  field :file_mime_type, type: String

  embedded_in :attachable, polymorphic: true
end

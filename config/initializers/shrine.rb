require "shrine"
require "shrine/storage/s3"
require "shrine/storage/file_system"

# if !Rails.env.production?
  s3_options = {
    access_key_id:     'AKIAJ45K32YD37C47NJA',
    secret_access_key: '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',
    bucket:            'cannected-dev',
    region:            'ap-southeast-1',
  }

  Shrine.storages = {
    avatar: Shrine::Storage::S3.new(prefix: "avatar", **s3_options),
    cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options),
    store: Shrine::Storage::S3.new(**s3_options),
  }
# else 
#   s3_options = {
#     access_key_id:     Rails.application.credentials.aws[:access_key_id],
#     secret_access_key: Rails.application.credentials.aws[:secret_access_key],
#     bucket:            Rails.application.credentials.aws[:bucket],
#     region:            Rails.application.credentials.aws[:region],
#   }

#   Shrine.storages = {
#     avatar: Shrine::Storage::S3.new(prefix: "avatar", **s3_options),
#     cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options),
#     store: Shrine::Storage::S3.new(**s3_options),
#   }
# end

# Mongoid Support - https://github.com/shrinerb/shrine-mongoid
Shrine.plugin :mongoid

# Mount upload endpoint from shrine
Shrine.plugin :upload_endpoint

# Direct upload to S3
Shrine.plugin :presign_endpoint, presign_options: ->(request) {
  # Uppy will send the "filename" and "type" query parameters
  filename = request.params["filename"]
  type     = request.params["type"]
  {
    # Set download filename
    content_disposition:    "inline; filename=\"#{filename}\"",
    # OR content_disposition:    ContentDisposition.inline(filename),
    # Set content type (defaults to "application/octet-stream")
    content_type:           type,
    # Limit upload size to 80 MB
    content_length_range:   0..(80 * 1024 * 1024),
  }
}

# Retaining the cached file across form re-displays
Shrine.plugin :cached_attachment_data

# re-extract metadata when attaching a cached file
Shrine.plugin :restore_cached_data

# Determines MIME type from file content
Shrine.plugin :determine_mime_type

# Save files metadata so easy to extract instead of trying to convert from
# N_data string.
Shrine.plugin :metadata_attributes, :size => :size, :mime_type => :mime_type, :filename => :filename

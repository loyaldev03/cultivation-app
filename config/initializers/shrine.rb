require "shrine"
require "shrine/storage/s3"
require "shrine/storage/file_system"

if Rails.env.development?
  s3_options = {
    access_key_id:     Rails.application.credentials.aws[:access_key_id],
    secret_access_key: Rails.application.credentials.aws[:secret_access_key],
    bucket:            Rails.application.credentials.aws[:bucket],
    region:            Rails.application.credentials.aws[:region],
  }
  Shrine.storages = {
    avatar: Shrine::Storage::S3.new(prefix: "avatar", **s3_options),
    cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options),
    store: Shrine::Storage::S3.new(**s3_options),
  }
else
  Shrine.storages = {
    avatar: Shrine::Storage::FileSystem.new("public", prefix: "uploads/avatar"),
    cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"),
    store: Shrine::Storage::FileSystem.new("public", prefix: "uploads/store"),
  }
end

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
    # Set content type (defaults to "application/octet-stream")
    content_type:           type,
    # Limit upload size to 10 MB
    content_length_range:   0..(10 * 1024 * 1024),
  }
}

# Retaining the cached file across form re-displays
Shrine.plugin :cached_attachment_data

# re-extract metadata when attaching a cached file
Shrine.plugin :restore_cached_data

# Determines MIME type from file content
Shrine.plugin :determine_mime_type

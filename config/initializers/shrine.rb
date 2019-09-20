require "shrine"
require "shrine/storage/s3"
require "shrine/storage/file_system"

s3_options = {
  access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  bucket:            ENV['AWS_BUCKET'],
  region:            ENV['AWS_REGION'],
}

# Avatar would allow public access without signed url
s3_public_options = {
  access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  bucket:            ENV['AWS_PUBLIC_BUCKET'],
  region:            ENV['AWS_REGION'],
}

if Rails.env.development? || Rails.env.test?
  s3_options = s3_public_options = {
    access_key_id: Rails.application.credentials.aws[:access_key_id],
    secret_access_key: Rails.application.credentials.aws[:secret_access_key],
    bucket: 'dev.cannected.com',
    region: 'ap-southeast-1',
  }
end

Shrine.storages = {
  avatar: Shrine::Storage::S3.new(prefix: "avatar", **s3_options),
  cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options),
  store: Shrine::Storage::S3.new(**s3_options),
}

# Mongoid Support - https://github.com/shrinerb/shrine-mongoid
Shrine.plugin :mongoid

# Mount upload endpoint from shrine
Shrine.plugin :upload_endpoint

# Direct upload to S3
Shrine.plugin :presign_endpoint, presign_options: ->(request) do
  # Uppy will send the "filename" and "type" query parameters
  filename = request.params["filename"]
  type     = request.params["type"]
  {
    # Set download filename
    content_disposition:    "inline; filename=\"#{filename}\"",
    # OR content_disposition:    ContentDisposition.inline(filename),
    # Set content type (defaults to "application/octet-stream")
    content_type:           type,
    # Limit upload size to 100 MB
    content_length_range:   0..(100 * 1024 * 1024),
  }
end

# Retaining the cached file across form re-displays
Shrine.plugin :cached_attachment_data

# re-extract metadata when attaching a cached file
Shrine.plugin :restore_cached_data

# Determines MIME type from file content
Shrine.plugin :determine_mime_type

# Save files metadata so easy to extract instead of trying to convert from
# N_data string.
Shrine.plugin :metadata_attributes, :size => :size, :mime_type => :mime_type, :filename => :filename

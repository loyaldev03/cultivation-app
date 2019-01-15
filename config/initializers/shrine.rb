require "shrine"
require "shrine/storage/s3"
require "shrine/storage/file_system"

s3_general_options = {
  access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  bucket:            ENV['AWS_BUCKET'],
  region:            ENV['AWS_REGION']
}

# Avatar would allow public access without signed url
s3_public_options = {
  access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  bucket:            ENV['AWS_PUBLIC_BUCKET'],
  region:            ENV['AWS_REGION']
}

Shrine.storages = {
  avatar: Shrine::Storage::S3.new(prefix: "avatar", public: true, **s3_public_options),
  cache: Shrine::Storage::S3.new(prefix: "cache", **s3_general_options),
  store: Shrine::Storage::S3.new(**s3_general_options),
}


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

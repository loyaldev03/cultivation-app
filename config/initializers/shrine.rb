require "shrine"
require "shrine/storage/file_system"

Shrine.storages = {
  cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"), # temporary
  store: Shrine::Storage::FileSystem.new("public", prefix: "uploads/store"), # permanent
  avatar: Shrine::Storage::FileSystem.new("public", prefix: "uploads/avatar"),
}

Shrine.plugin :mongoid                # https://github.com/shrinerb/shrine-mongoid
Shrine.plugin :upload_endpoint        # mount upload endpoint from shrine
Shrine.plugin :cached_attachment_data # for retaining the cached file across form re-displays
Shrine.plugin :restore_cached_data    # re-extract metadata when attaching a cached file

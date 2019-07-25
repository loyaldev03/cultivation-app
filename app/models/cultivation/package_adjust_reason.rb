module Cultivation
  class PackageAdjustReason
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :requires_note, type: Boolean, default: -> { false }
  end
end

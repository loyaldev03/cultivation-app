module Inventory
  class MetrcTag
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    belongs_to :facility, class_name: 'Facility'

    field :tag, type: String
    field :tag_type, type: String # plant, package
    # available: Tag is available to use
    # assigned: Tag has been assigned to Batch / Plant or Package
    # disposed: Tag is broken, lost. Need to be reported.
    field :status, type: String
    field :replaced_by, type: String
    # when this tag has been assigned in Cannected, and corresponding
    # record has been pushed  to METRC, set this flag to true
    field :reported_to_metrc, type: Boolean, default: -> { false }
  end
end

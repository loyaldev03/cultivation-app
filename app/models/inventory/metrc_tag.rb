module Inventory
  class MetrcTag
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    belongs_to :facility, class_name: 'Facility'

    field :tag, type: String
    field :tag_type, type: String       # plant, package
    field :status, type: String         # available, assigned, disposed
    field :replaced_by, type: String
  end
end

module Inventory
  class MetrcTag
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    belongs_to :facility, class_name: 'Facility'

    field :tag, type: String
    field :tag_type, type: String       # Plant Tag or Package Tag
    field :status, type: String         # available, used, disposed
    field :replaced_by, type: String
  end
end

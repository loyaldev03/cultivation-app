class Shelf
  include Mongoid::Document

  field :code, type: String
  field :capacity, type: Integer, default: -> { 0 }
  field :wz_generated, type: Boolean, default: -> { true }

  # When set to false, hide "trays" in UI and bring trays[0]
  # up to shelf level (user would see the capacity is on
  # the shelf level instead)
  field :is_use_trays, type: Boolean, default: -> { false }

  embedded_in :row

  has_many :trays, dependent: :restrict
end

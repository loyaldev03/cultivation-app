class Shelf
  include Mongoid::Document

  field :code, type: String
  field :full_code, type: String
  field :capacity, type: Integer, default: -> { 0 }
  field :wz_generated, type: Boolean, default: -> { true }

  # When set to false, hide "trays" in UI and bring trays[0]
  # up to shelf level (user would see the capacity is on
  # the shelf level instead)
  # NOTE: Tray == Table (same meaning)
  # NOTE: This field is initially updated when user indicate
  # using table on UI - See "generate_shelves" for more info
  field :is_use_trays, type: Boolean, default: -> { false }

  # Shelf is consider complete if all trays contain capacity
  # and capacity_type info
  field :is_complete, type: Boolean, default: -> { false }

  embedded_in :row, class_name: 'Row'

  has_many :trays, class_name: 'Tray', dependent: :delete_all
end

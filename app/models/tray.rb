class Tray
  include Mongoid::Document

  field :code, type: String
  field :full_code, type: String
  field :capacity, type: Integer
  field :capacity_type, type: String # TRAY_CAPACITY_TYPES
  field :wz_generated, type: Boolean, default: -> { true }

  belongs_to :shelf, class_name: 'Shelf', optional: true
end

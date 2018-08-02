class Tray
  include Mongoid::Document

  field :code, type: String
  field :capacity, type: Integer
  field :capacity_type, type: String # TRAY_CAPACITY_TYPES

  belongs_to :shelf
end

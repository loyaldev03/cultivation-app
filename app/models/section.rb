class Section
  include Mongoid::Document

  field :name, type: String
  field :code, type: String
  field :purpose, type: String
  # when purpose is Drying, purpose_option is Drying Method
  field :purpose_option, type: String
  # Indicate the Dry Rake has multiple level
  field :rack_has_levels, type: Boolean, default: -> { false }
  # Dry rack count or High rise rack count
  field :rack_count, type: Integer

  embedded_in :room, class_name: 'Room'
end

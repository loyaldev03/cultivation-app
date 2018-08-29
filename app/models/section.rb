class Section
  include Mongoid::Document

  field :name, type: String
  field :code, type: String
  field :purpose, type: String
  field :purpose_option, type: String   # when purpose is Drying, purpose_option is Drying Method

  embedded_in :room
end

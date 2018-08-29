class Section
  include Mongoid::Document

  field :name, type: String
  field :code, type: String
  field :purpose, type: String

  embedded_in :room
end

class Shelf
  include Mongoid::Document
  field :code, type: String
  field :desc, type: String
  field :capacity, type: Integer

  embedded_in :section
end

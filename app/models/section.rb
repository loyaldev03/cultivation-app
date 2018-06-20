class Section
  include Mongoid::Document
  field :name, type: String
  field :code, type: String
  field :desc, type: String
  field :purpose, type: String
  field :activities, type: String
  field :row_count, type: Integer
  field :shelf_count, type: Integer
  field :capacity, type: Integer

  embedded_in :room
  embeds_many :shelves
end

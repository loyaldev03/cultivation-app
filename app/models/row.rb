class Row
  include Mongoid::Document

  field :name, type: String
  field :code, type: String

  embedded_in :section
  embeds_many :shelves, class_name: 'Shelf'
end

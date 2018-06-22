class Row
  include Mongoid::Document

  field :code, type: String

  embeds_many :shelves
end

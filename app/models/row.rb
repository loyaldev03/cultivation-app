class Row
  include Mongoid::Document

  field :name, type: String
  field :code, type: String
  field :has_shelves, type: Boolean, default: -> { false }
  field :has_trays, type: Boolean, default: -> { false }
  field :is_complete, type: Boolean, default: -> { false }
  # indicate record was generated by wizard
  # set to false after user saved
  field :wz_generated, type: Boolean, default: -> { true }
  field :wz_shelves_count, type: Integer, default: -> { 1 }
  field :wz_trays_count, type: Integer, default: -> { 0 }

  embedded_in :room
  embeds_many :shelves, class_name: 'Shelf'
end

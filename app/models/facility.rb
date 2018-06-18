class Facility
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :code, type: String
  field :address, type: String
  field :zipcode, type: String
  field :city, type: String
  field :state, type: String
  field :country, type: String
  field :timezone, type: String
  field :phone, type: String
  field :fax, type: String
  field :is_complete, type: Boolean, default: -> { false }
  field :is_enabled, type: Boolean, default: -> { true }
  field :room_count, type: Integer

  embeds_many :rooms

  scope :completed, -> { where(is_complete: true) }
end

class Room
  include Mongoid::Document
  field :name, type: String
  field :code, type: String
  field :desc, type: String
  field :section_count, type: Integer
  field :is_complete, type: Boolean, default: -> { false }

  embedded_in :facility
  embeds_many :sections
end

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

class Shelf
  include Mongoid::Document
  field :code, type: String
  field :desc, type: String
  field :capacity, type: Integer

  embedded_in :section
end

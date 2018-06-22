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
  field :room_count, type: Integer # for wizard, show only when is_complete = false

  embeds_many :rooms

  # TODO: refactor into Service Object
  scope :completed, -> { where(is_complete: true) }

  def display_name
    name.blank? ? '- no name -' : name
  end
end

class Room
  include Mongoid::Document

  field :name, type: String
  field :code, type: String
  field :desc, type: String
  field :section_count, type: Integer # for wizard, show only when is_complete = false
  field :is_complete, type: Boolean, default: -> { false }

  embedded_in :facility
  embeds_many :sections
end

class Section
  include Mongoid::Document

  field :name, type: String
  field :code, type: String
  field :desc, type: String
  field :purpose, type: String          # e.g. :storage, :cultivation, :other
  field :custom_purpose, type: String   # used when purpose = :other, e.g. 'general'
  field :storage_types, type: Array     # purpose = :storage, e.g. :consumable, :sales_items
  field :cultivation_types, type: Array # purpose = :cultivation, e.g. :mothering, :clone
  field :row_count, type: Integer       # for wizard, show only when is_complete = false
  field :shelf_count, type: Integer     # for wizard, show only when is_complete = false
  field :shelf_capacity, type: Integer  # for wizard, show only when is_complete = false
  field :is_complete, type: Boolean, default: -> { false }

  embedded_in :room
  embeds_many :rows
end

class Row
  include Mongoid::Document

  field :name, type: String
  field :code, type: String

  embedded_in :section
  embeds_many :shelves, class_name: 'Shelf'
end

class Shelf
  include Mongoid::Document

  field :code, type: String
  field :desc, type: String
  field :capacity, type: Integer

  embedded_in :row
end

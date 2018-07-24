class Room
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :code, type: String
  field :desc, type: String
  field :purpose, type: String
  field :section_count, type: Integer # for wizard, show only when is_complete = false
  field :is_complete, type: Boolean, default: -> { false }

  embedded_in :facility
  embeds_many :sections
end

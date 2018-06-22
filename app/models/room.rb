class Room
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :code, type: String
  field :desc, type: String
  field :section_count, type: Integer
  field :is_complete, type: Boolean, default: -> { false }

  embedded_in :facility
  embeds_many :sections

  validates :code, presence: true, on: :admin_update
end

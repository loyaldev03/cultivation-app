class Facility
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :code, type: String
  field :address, type: String
  field :city, type: String
  field :state, type: String
  field :zipcode, type: String
  field :country, type: String
  field :timezone, type: String
  field :phone, type: String
  field :fax, type: String
  field :is_complete, type: Boolean, default: -> { false }
  field :is_enabled, type: Boolean, default: -> { true }
  field :room_count, type: Integer # for wizard, show only when is_complete = false

  embeds_many :rooms

  scope :completed, -> { where(is_complete: true) }
end

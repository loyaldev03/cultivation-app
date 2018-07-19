class Facility
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :code, type: String
  field :company_name, type: String
  field :state_license, type: String
  field :site_license, type: String
  field :timezone, type: String
  field :is_complete, type: Boolean, default: -> { false }
  field :is_enabled, type: Boolean, default: -> { true }

  embeds_one :address, as: :addressable, class_name: 'Address'
  embeds_many :rooms

  scope :completed, -> { where(is_complete: true) }
end

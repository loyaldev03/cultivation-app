class Vendor
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :default_terms, type: String
  field :status, type: String
  field :notes, type: String

  embeds_many :addresses, as: :addressable, class_name: 'Address'
end

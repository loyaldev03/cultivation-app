class Address
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :address, type: String
  field :city, type: String
  field :state, type: String
  field :zipcode, type: String
  field :country, type: String
  field :is_residential, type: Boolean, default: -> { false }
  field :main_number, type: String
  field :mobile_number, type: String
  field :fax_number, type: String
  field :email, type: String

  embedded_in :addressable, polymorphic: true
end

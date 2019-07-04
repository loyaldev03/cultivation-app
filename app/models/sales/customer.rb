module Sales
  class Customer
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :account_no, type: String
    field :status, type: String

    embeds_many :addresses, as: :addressable, class_name: 'Address'

    accepts_nested_attributes_for :addresses, allow_destroy: true
  end
end

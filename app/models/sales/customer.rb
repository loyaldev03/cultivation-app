module Sales
  class Customer
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :customer_no, type: String

    embeds_many :addresses, as: :addressable, class_name: 'Address'
  end
end

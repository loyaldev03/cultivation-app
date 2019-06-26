class MetrcHistory
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :code, type: String
  field :value, type: Time

  belongs_to :facility, class_name: 'Facility'
end

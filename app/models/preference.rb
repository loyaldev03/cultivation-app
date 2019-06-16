class Preference
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :code, type: String
  field :value, type: Boolean, default: -> { false }

  embedded_in :facility, class_name: 'Facility'
end

module Inventory
  class Nutrient
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :element, type: String
    field :value, type: Float
    field :checked, type: Boolean, default: -> { false }

    validates :element, presence: true

    embedded_in :nutrition, polymorphic: true
  end
end

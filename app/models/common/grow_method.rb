module Common
  class GrowMethod
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :is_active, type: Boolean

    scope :active, -> { where(is_active: true) }
  end
end

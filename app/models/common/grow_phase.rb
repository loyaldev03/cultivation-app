module Common
  class GrowPhase
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :is_active, type: Boolean, default: true
    field :number_of_days, type: Integer
    field :number_of_days_avg, type: Integer

    scope :active, -> { where(is_active: true) }
  end
end

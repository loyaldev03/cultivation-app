
module Common
  class GrowPhase
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :is_active, type: Boolean, default: true
  end
end

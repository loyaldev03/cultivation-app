module Cultivation
  class Breakdown
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :cost_type, type: String # OT, Normal
    field :duration, type: Float #in minutes
    field :cost, type: Float
    field :rate, type: Float
  end
end

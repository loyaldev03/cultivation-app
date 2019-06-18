module Cultivation
  class PlantWasteMethod
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
  end
end

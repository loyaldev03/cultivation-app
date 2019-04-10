module Cultivation
  class HarvestBatch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :uom, type: String
    field :harvest_room, type: String
  end
end

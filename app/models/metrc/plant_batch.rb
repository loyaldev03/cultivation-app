module Metrc
  class PlantBatch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :metrc_tag, type: String # this is plant tag
    field :metrc_id, type: Integer # this is from metrc
    field :plant_type, type: String # "Clone" / "Seed"
    field :count, type: String # Number of plants in this lot, max 100
    field :strain, type: String
    field :room, type: String # Room name
    field :actual_date, type: String # Date when this batch become active "2018-12-15"

    field :lot_no, type: Integer
    field :batch_id, type: BSON::ObjectId
  end
end

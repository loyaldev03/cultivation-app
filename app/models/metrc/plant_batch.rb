module Metrc
  class PlantBatch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    # Fields update after batch scheduled
    field :batch_id, type: BSON::ObjectId
    field :lot_no, type: Integer
    field :count, type: String # Number of plants in this lot, max 100
    field :strain, type: String
    field :plant_type, type: String # "Clone" / "Seed"
    field :actual_date, type: String # Date when this batch become active "2018-12-15"
    field :metrc_tag, type: String # this is plant tag

    # Update when user has verified metrc tag has been consumed from inventory
    field :metrc_tag_verified, type: Boolean, default: -> { false }

    # Fields update after push to metrc
    field :room, type: String # Room name
    field :metrc_id, type: Integer # this is from metrc
  end
end

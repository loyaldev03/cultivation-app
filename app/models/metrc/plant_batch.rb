module Metrc
  class PlantBatch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    # Fields update after batch scheduled

    # Original Cultivation::Batch that generated this record
    field :batch_id, type: BSON::ObjectId
    # Lot no for this batch, this is only for visualization
    field :lot_no, type: Integer
    # Number of plants in this lot, max 100
    field :count, type: String
    # Facility strain name
    field :strain, type: String
    # "Clone" or "Seed" - need to correspond to Metrc Plant Type
    field :plant_type, type: String
    # Date when this batch become active "2018-12-15"
    # This value should be in UTC, and correspond to Batch's Start Date
    field :actual_date, type: String
    # This is Plant tag assigned to this batch.
    # In CA, each batch is max at 100 quantity
    field :metrc_tag, type: String

    # Update when user has verified metrc tag has been consumed from inventory
    field :metrc_tag_verified, type: Boolean, default: -> { false }

    # Fields update after push to metrc
    field :room, type: String # Room name
    field :metrc_id, type: Integer # this is from metrc
    field :metrc_strain_id, type: Integer
    field :metrc_tracked_count, type: Integer
    field :metrc_untracked_count, type: Integer
  end
end

module Cultivation
  class PlantMovementHistory
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :batch_id, type: BSON::ObjectId
    # E.g. match Task.phase, e.g. clone, veg1, veg2
    field :phase, type: String
    # E.g. match Task.indelible, e.g. clip_pot_tag, moving_to_tray...
    field :activity, type: String
    # Reference Task.id
    # field :task_id, type: BSON::ObjectId
    # Mother plant id (for clipping task)
    field :mother_plant_id, type: BSON::ObjectId
    field :mother_plant_code, type: String
    # User who perform this action
    field :user_id, type: BSON::ObjectId
    field :user_name, type: BSON::ObjectId
    # Destination location after user performed action
    field :destination_id, type: BSON::ObjectId
    field :destination_type, type: String
    field :destination_code, type: String
    field :plants, type: Array, default: -> { [] }
  end
end

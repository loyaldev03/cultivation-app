module Cultivation
  class PlantMovementHistory
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :batch_id, type: BSON::ObjectId
    # E.g. match Task.phase, e.g. clone, veg1, veg2
    field :phase, type: String
    # E.g. match Task.indelible, e.g. clip_pot_tag, moving_to_tray...
    field :activity, type: String
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

    # Reference to the task that created this record
    belongs_to :task, class_name: 'Cultivation::Task', inverse_of: :movement_histories, optional: true
  end
end

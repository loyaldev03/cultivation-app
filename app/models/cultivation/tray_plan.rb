module Cultivation
  class TrayPlan
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :facility_id, type: BSON::ObjectId
    field :room_id, type: BSON::ObjectId
    field :row_id, type: BSON::ObjectId
    field :shelf_id, type: BSON::ObjectId
    field :tray_id, type: BSON::ObjectId
    field :start_date, type: DateTime
    field :end_date, type: DateTime
    field :capacity, type: Integer
    field :phase, type: String                  # cultivation phase TODO: not important? coz we already know it's been booked
    field :is_active, default: -> { true }      # indicate the record is still in-use.
    field :is_fulfilled, default: -> { false }  # indicate the tray is currently being occupied.

    belongs_to :batch, class_name: 'Cultivation::Batch'
  end
end
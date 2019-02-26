module Cultivation
  class Note
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include Mongoid::History::Trackable

    field :body, type: String

    embedded_in :task, class_name: 'Cultivation::Task'

    track_history on: [:body],
                  modifier_field: :modifier,
                  modifier_field_inverse_of: nil,
                  modifier_field_optional: true,
                  tracker_class_name: :task_history_tracker
  end
end

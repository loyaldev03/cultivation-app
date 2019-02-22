module Cultivation
  class Note
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include Mongoid::History::Trackable

    field :body, type: String

    embedded_in :task, class_name: 'Cultivation::Task', inverse_of: :notes
  end
end

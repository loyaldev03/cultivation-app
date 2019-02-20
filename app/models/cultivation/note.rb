module Cultivation
  class Note
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :notes, type: String

    belongs_to :task, class_name: 'Cultivation::Task'
    belongs_to :user, class_name: 'User'
  end
end

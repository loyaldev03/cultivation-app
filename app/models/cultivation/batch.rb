module Cultivation
  class Batch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String

    has_many :tasks, class_name: 'Cultivation::Task'
  end
end

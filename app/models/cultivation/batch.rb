module Cultivation
  class Batch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :batch_source, type: String
    field :strain, type: String
    field :start_date, type: DateTime

    has_many :tasks, class_name: 'Cultivation::Task'
  end
end

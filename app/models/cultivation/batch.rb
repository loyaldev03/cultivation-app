module Cultivation
  class Batch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :batch_no, type: String
    field :batch_source, type: String
    field :strain, type: String   # TODO: Change this to strain ID
    field :start_date, type: DateTime
    field :facility_id, type: BSON::ObjectId
    field :grow_method, type: String
    field :quantity, type: String

    has_many :tasks, class_name: 'Cultivation::Task'
  end
end

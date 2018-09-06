module Cultivation
  class Batch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :batch_no, type: String
    field :batch_source, type: String
    field :strain_id, type: BSON::ObjectId   # TODO: Change this to strain ID
    field :start_date, type: DateTime
    field :facility_id, type: BSON::ObjectId
    field :grow_method, type: String

    has_one :tray_plan, class_name:'Cultivation::TrayPlan'
    has_many :tasks, class_name: 'Cultivation::Task'
  end
end

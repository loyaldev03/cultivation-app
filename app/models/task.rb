class Task
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :instruction, type: String
  field :batch_id, type: Integer
  field :start_date, type: DateTime
  field :expected_time_spent, type: String
  field :user_id, type: Integer
  field :created_by, type: Integer
  field :task_type, type: String
  field :notes, type: String
end

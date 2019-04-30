module Common
  class WorkRequest
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :request_type, type: String # Overtime, Paid Time Off
    field :start_time, type: Time
    field :end_time, type: Time
    field :description, type: String

    belongs_to :user, class_name: 'User'
    belongs_to :reporting_manager, class_name: 'User', inverse_of: :work_applications
  end
end

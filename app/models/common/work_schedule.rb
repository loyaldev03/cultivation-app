module Common
  class WorkSchedule
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :day, type: String # Monday, Tuesday, Wednesday
    field :start_time, type: Time, default: Time.new(2019, 4, 21, 9, 00)
    field :end_time, type: Time, default: Time.new(2019, 4, 21, 17, 00)

    embedded_in :user, class_name: 'User'
  end
end

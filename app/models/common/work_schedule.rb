module Common
  class WorkSchedule
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    #exempt worker -> salary worker
    field :day, type: String # Monday, Tuesday, Wednesday

    #non exempt worker -> hourly worker
    field :date, type: Time
    field :arrival_status, type: String # absent, on-time, late
    field :timesheet_status, type: String # open, approved, declined,
    field :start_time, type: Time, default: Time.new(2019, 1, 1, 9, 00)
    field :end_time, type: Time, default: Time.new(2019, 1, 1, 17, 00)

    embedded_in :user, class_name: 'User'
  end
end

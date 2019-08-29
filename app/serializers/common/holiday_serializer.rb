module Common
  class HolidaySerializer
    include FastJsonapi::ObjectSerializer
    attributes :title, :duration

    attribute :start_date do |object|
      object.start_date
    end
    attribute :end_date do |object|
      object.end_date
    end
  end
end

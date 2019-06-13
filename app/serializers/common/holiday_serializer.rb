module Common
  class HolidaySerializer
    include FastJsonapi::ObjectSerializer
    attributes :date, :title

    attribute :date do |object|
      object.date.strftime('%Y-%m-%d ')
    end
  end
end

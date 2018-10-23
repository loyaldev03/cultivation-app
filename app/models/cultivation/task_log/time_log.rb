module Cultivation
  module TaskLog
    class TimeLog
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :start, type: DateTime
      field :end, type: DateTime

      embedded_in :work_day, class_name: 'Cultivation::WorkDay'
    end
  end
end

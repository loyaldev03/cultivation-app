module Cultivation
  module WorkLog
    class Log
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :notes, type: String
      field :duration, type: Integer, default: 0 # in seconds


      embedded_in :work_day, class_name: 'Cultivation::WorkDay'
      embeds_many :materials_used, class_name: 'Cultivation::WorkLog::MaterialUsed'
      embeds_many :trays_worked_on, class_name: 'Cultivation::WorkLog::TrayWorkedOn'
    end
  end
end

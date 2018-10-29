module Cultivation
  module TaskLog
    class Note
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      field :notes, type: String

      embedded_in :work_day, class_name: 'Cultivation::WorkDay'
    end
  end
end

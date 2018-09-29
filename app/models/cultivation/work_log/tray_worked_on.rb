module Cultivation
  module WorkLog
    class TrayWorkedOn
      include Mongoid::Document
      include Mongoid::Timestamps::Short

      belongs_to :tray, class_name: 'Tray'
      has_many :plants, class_name: 'Inventory::Plant'

      embedded_in :work_log, class_name: 'Cultivation::WorkLog::Log'
    end
  end
end

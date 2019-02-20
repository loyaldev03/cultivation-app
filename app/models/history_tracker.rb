class HistoryTracker
  include Mongoid::History::Tracker
end

class PlantHistoryTracker
  include Mongoid::History::Tracker
end

class BatchHistoryTracker
  include Mongoid::History::Tracker
end

class TaskHistoryTracker
  include Mongoid::History::Tracker
end

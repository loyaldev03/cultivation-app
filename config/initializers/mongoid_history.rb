require "./app/models/history_tracker"
Mongoid::History.tracker_class_name = :history_tracker

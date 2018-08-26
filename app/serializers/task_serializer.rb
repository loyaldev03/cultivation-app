class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :phase, :task_category, :start_date, :end_date
end

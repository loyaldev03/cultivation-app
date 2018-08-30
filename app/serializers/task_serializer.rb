class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :phase, :task_category, :name, :days, :days_from_start_date, 
    :expected_start_date, :expected_end_date, :start_date, :end_date, :expected_hours_taken,
    :time_taken, :no_of_employees, :materials, :instruction
end
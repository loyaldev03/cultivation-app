class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :phase, :task_category, :name, :days, :days_from_start_date,
    :expected_start_date, :expected_end_date, :end_date, :estimated_hours,
    :time_taken, :no_of_employees, :materials, :instruction, :isPhase, :isCategory, :parent_id, :depend_on

  attribute :start_date do |object|
    object.start_date.try(:strftime, '%m/%d/%Y')
  end

  attribute :end_date do |object|
    object.end_date.try(:strftime, '%m/%d/%Y')
  end
end

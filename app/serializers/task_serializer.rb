class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :phase, :task_category, :name, :duration, :days_from_start_date, :position,
    :expected_start_date, :expected_end_date, :end_date, :estimated_hours,
    :time_taken, :no_of_employees, :materials, :instruction, :is_phase, :is_category, :parent_id, :depend_on

  attributes :id do |object|
    object.id.to_s
  end
  attribute :start_date do |object|
    object.start_date.try(:strftime, '%m/%d/%Y')
  end

  attribute :end_date do |object|
    object.end_date.try(:strftime, '%m/%d/%Y')
  end
end

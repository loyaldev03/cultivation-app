class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :phase, :task_category, :name, :duration, :days_from_start_date, :position,
    :expected_start_date, :expected_end_date, :end_date, :estimated_hours, :users,
    :time_taken, :no_of_employees, :items, :instruction, :is_phase, :is_category, :parent_id, :depend_on

  attributes :id do |object|
    object.id.to_s
  end
  attribute :start_date do |object|
    object.start_date.try(:strftime, '%m/%d/%Y')
  end

  attribute :end_date do |object|
    object.end_date.try(:strftime, '%m/%d/%Y')
  end

  #for showing in table column resources
  attribute :resources do |object|
    object.users.map { |a| a.display_name }.join(',')
  end

  # attribute :item_display do |object|
  #   object.items.map {|a| a.name}.join(',')
  # end

  attribute :items do |object|
    object.items.map do |item|
      {
        id: item.id.to_s,
        name: item.name,
        quantity: item.quantity,
        uom: item.uom,
      }
    end
  end

  attribute :user_ids do |object|
    object.user_ids.map { |a| a.to_s }
  end
end

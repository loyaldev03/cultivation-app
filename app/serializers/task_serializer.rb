class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :phase,
    :task_category,
    :name,
    :duration,
    :days_from_start_date,
    :start_date,
    :end_date,
    :position,
    :estimated_hours,
    :users,
    :is_phase,
    :is_category,
    :parent_id,
    :depend_on,
    :task_type

  attributes :id do |object|
    object.id.to_s
  end

  #for showing in table column resources
  attribute :resources do |object|
    object.users.map { |a| a.display_name }.join(',')
  end

  attribute :item_display do |object|
    object.material_use.map { |a| a.name }.join(',')
  end

  attribute :items do |object|
    object.material_use.map do |item|
      {
        id: item.id.to_s,
        name: item.name,
        quantity: item.quantity,
        uom: item.uom,
        raw_material_id: item.try(:raw_material_id).to_s,
      }
    end
  end

  attribute :user_ids do |object|
    object.user_ids.map { |a| a.to_s }
  end

  attribute :estimated_hours do |object|
    if object.is_phase
      sum = 0.0
      object.children.each do |child|
        sum += child.children.sum(:estimated_hours)
      end
      '%.2f' % sum
    elsif object.is_category
      '%.2f' % object.children.sum(:estimated_hours)
    else
      '%.2f' % object.estimated_hours if object.estimated_hours
    end
  end

  attribute :actual_hours do |object|
    if object.is_phase
      sum = 0.0
      object.children.each do |child|
        sum += child.children.sum(:actual_hours)
      end
      '%.2f' % sum
    elsif object.is_category
      '%.2f' % object.children.sum(:actual_hours)
    else
      '%.2f' % object.actual_hours if object.actual_hours
    end
  end

  attribute :estimated_cost do |object|
    if object.is_phase
      sum = 0.0
      object.children.each do |child|
        sum_category = 0.0
        child.children.each do |a|
          sum_category += a.estimated_cost if a.estimated_cost
        end
        sum += sum_category
      end
      '%.2f' % sum
    elsif object.is_category
      sum = 0.0
      object.children.each do |child|
        sum += child.estimated_cost if child.estimated_cost
      end
      '%.2f' % sum
    else
      '%.2f' % object.estimated_cost if object.estimated_cost
    end
  end

  attribute :actual_cost do |object|
    if object.is_phase
      sum = 0.0
      object.children.each do |child|
        sum += child.children.sum(:actual_cost)
      end
      '%.2f' % sum
    elsif object.is_category
      '%.2f' % object.children.sum(:actual_cost)
    else
      '%.2f' % object.actual_cost if object.actual_cost
    end
  end
end

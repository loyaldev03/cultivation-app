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
  attribute :resources do |object, params|
    users = params[:users].select { |a| object.user_ids.include?(a.id) }
    users.map { |a| a.display_name }.join(',')
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
        catalogue_id: item&.catalogue_id&.to_s,
        uoms: item&.catalogue&.uoms&.pluck(:unit),
      }
    end
  end

  attribute :user_ids do |object|
    object.user_ids.map { |a| a.to_s }
  end

  attribute :estimated_hours do |object, params|
    children = params[:tasks].select { |a| a.parent_id == object.id.to_s }
    if object.is_phase
      sum = 0.0
      children.each do |child|
        child_children = params[:tasks].select { |a| a.parent_id == child.id.to_s }
        sum += child_children.map { |a| a.estimated_hours.to_f }.sum
      end
      '%.2f' % sum
    elsif object.is_category
      '%.2f' % children.map { |a| a.estimated_hours.to_f }.sum
    else
      '%.2f' % object.estimated_hours if object.estimated_hours
    end
  end

  attribute :actual_hours do |object, params|
    children = params[:tasks].select { |a| a.parent_id == object.id.to_s }
    if object.is_phase
      sum = 0.0
      children.each do |child|
        child_children = params[:tasks].select { |a| a.parent_id == child.id.to_s }
        sum += child_children.map { |a| a.actual_hours.to_f }.sum
      end
      '%.2f' % sum
    elsif object.is_category
      '%.2f' % children.map { |a| a.actual_hours.to_f }.sum
    else
      '%.2f' % object.actual_hours if object.actual_hours
    end
  end

  attribute :estimated_cost do |object, params|
    children = params[:tasks].select { |a| a.parent_id == object.id.to_s }
    if object.is_phase
      sum = 0.0
      children.each do |child|
        sum_category = 0.0
        child_children = params[:tasks].select { |a| a.parent_id == child.id.to_s }
        child_children.each do |a|
          sum_category += a.estimated_cost if a.estimated_cost
        end
        sum += sum_category
      end
      '%.2f' % sum
    elsif object.is_category
      sum = 0.0
      children.each do |child|
        sum += child.estimated_cost if child.estimated_cost
      end
      '%.2f' % sum
    else
      '%.2f' % object.estimated_cost if object.estimated_cost
    end
  end

  attribute :actual_cost do |object, params|
    children = params[:tasks].select { |a| a.parent_id == object.id.to_s }
    if object.is_phase
      sum = 0.0
      children.each do |child|
        child_children = params[:tasks].select { |a| a.parent_id == child.id.to_s }
        sum += child_children.map { |a| a.actual_cost.to_f }.sum
      end
      '%.2f' % sum
    elsif object.is_category
      '%.2f' % children.map { |a| a.actual_cost.to_f }.sum
    else
      '%.2f' % object.actual_cost if object.actual_cost
    end
  end
end

class TaskSerializer
  include FastJsonapi::ObjectSerializer

  attributes :phase,
    :name,
    :duration,
    :start_date,
    :end_date,
    :position,
    :estimated_hours,
    :estimated_cost,
    :wbs,
    :indent,
    :task_type

  attributes :id do |object|
    object.id.to_s
  end

  attributes :parent_id do |object|
    object.parent_id.to_s
  end

  attributes :depend_on do |object|
    object.depend_on.to_s
  end

  attributes &:wbs

  attribute :items do |object|
    object.material_use.map do |item|
      {
        id: item.id.to_s,
        product_name: item.product.try(:name),
        product_id: item.product.try(:id).to_s,
        category: item.product.try(:catalogue).try(:category),
        quantity: item.quantity,
        uom: item.uom,
        catalogue_id: item&.catalogue_id&.to_s,
        uoms: item&.product&.catalogue&.uoms&.pluck(:unit),
      }
    end
  end

  attribute :user_ids do |object|
    object.user_ids.map(&:to_s)
  end

  # TODO: Move to UI
  attribute :actual_hours do |object, params|
    object.actual_hours
    # children = params[:tasks].select { |a| a.parent_id == object.id.to_s }
    # if object.is_phase
    #   sum = 0.0
    #   children.each do |child|
    #     child_children = params[:tasks].select { |a| a.parent_id == child.id.to_s }
    #     sum += child_children.map { |a| a.actual_hours.to_f }.sum
    #   end
    #   '%.2f' % sum
    # elsif object.is_category
    #   '%.2f' % children.map { |a| a.actual_hours.to_f }.sum
    # else
    #   '%.2f' % object.actual_hours if object.actual_hours
    # end
  end

  attribute :actual_cost do |object, params|
    object.actual_cost
    # children = params[:tasks].select { |a| a.parent_id == object.id.to_s }
    # if object.is_phase
    #   sum = 0.0
    #   children.each do |child|
    #     child_children = params[:tasks].select { |a| a.parent_id == child.id.to_s }
    #     sum += child_children.map { |a| a.actual_cost.to_f }.sum
    #   end
    #   '%.2f' % sum
    # elsif object.is_category
    #   '%.2f' % children.map { |a| a.actual_cost.to_f }.sum
    # else
    #   '%.2f' % object.actual_cost if object.actual_cost
    # end
  end
end

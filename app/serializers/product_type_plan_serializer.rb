class ProductTypePlanSerializer
  include FastJsonapi::ObjectSerializer

  attributes :product_type, :quantity_type

  attribute :sub_categories do |object, params|
    if params[:product_categories]
      record = params[:product_categories].find { |a| a['name'] == object.product_type }
      record['package_units']
    end
  end

  attributes :id do |object|
    object.id.to_s
  end

  attribute :batch_id do |object|
    object.batch_id.to_s
  end

  attribute :package_plans do |object|
    object.package_plans.map do |plan|
      {
        id: plan.id.to_s,
        package_type: plan.package_type,
        quantity_type: plan.quantity_type,
        quantity: plan.quantity,
        uom: plan.uom,
        total_weight: plan.total_weight,
        conversion: plan.conversion,
      }
    end
  end
end

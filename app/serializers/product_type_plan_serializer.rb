class ProductTypePlanSerializer
  include FastJsonapi::ObjectSerializer

  attributes :product_type

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
        quantity: plan.quantity,
        uom: plan.uom,
        total_weight: plan.total_weight,
      }
    end
  end
end

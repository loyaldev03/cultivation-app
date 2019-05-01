class Api::V1::ProductPlansController < Api::V1::BaseApiController
  ##
  # Returns all productTypePlan of a batch
  #
  def index
    product_types = Cultivation::ProductTypePlan.where(batch_id: params[:batch_id])
    render json: ProductTypePlanSerializer.new(product_types).serialized_json, status: 200
  end

  ##
  # Adds a productTypePlan to a batch
  #
  def create
    product_type = Cultivation::ProductTypePlan.new(
      cultivation_batch_id: params[:batch_id],
      product_type: params[:product_type],
    )
    if product_type.save
      render json: ProductTypePlanSerializer.new(product_type).serialized_json, status: 200
    else
      render json: {error: product_type.errors.full_messages}, status: 422
    end
  end

  ##
  # Destroys the productTypePlan to a batch
  #
  def destroy
    product_type = Cultivation::ProductTypePlan.find_by(
      cultivation_batch_id: params[:batch_id],
      product_type_id: params[:product_type_id],
    )

    if product_type.nil?
      render json: {error: ['Record not found.']}, status: 422
    elsif product_type.save
      render json: ProductTypePlanSerializer.new(product_type).serialized_json, status: 200
    else
      render json: {error: product_type.errors.full_messages}, status: 422
    end
  end

  ##
  # Create/ update the child of productTypePlan (i.e the PackagePlan)
  #
  def save_package_plan
    product_type = Cultivation::ProductTypePlan.find_by(
      cultivation_batch_id: params[:batch_id],
      product_type_id: params[:product_type_id],
    )

    package_plan = product_type.package_plans.create(
      package_type: params[:package_type],
      quantity: params[:quantity],
      uom: params[:package_type],  # <--- should be inferred from package_type
      total_weight: params[:quantity],
    )

    render json: package_plan.id, status: 200
  end

  ##
  # Deletes the child of productTypePlan (i.e the PackagePlan)
  #
  def delete_package_plan
    product_type = Cultivation::ProductTypePlan.find_by(
      cultivation_batch_id: params[:batch_id],
      product_type_id: params[:product_type_id],
    )

    package_plan = product_type.package_plans.find(params[:id])
    package_plan.destroy!

    render json: package_plan.id, status: 200
  end
end

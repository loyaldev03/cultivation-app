class MetrcCreateAdditives
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(task_id)
    #build params here
    task = Cultivation::Task.find(task_id)
    batch = task.batch
    metrc_batches = Metrc::PlantBatch.where(batch_id: batch.id)
    nutrients = batch.nutrient_profiles.where(task_id: task_id)
    facility = task.facility
    metrc_params = []
    product_params = []

    nutrients.each do |nutrient|
      product = Inventory::Product.find(nutrient.product_id)
      product_params << generate_product_params(product)
    end

    metrc_batches.each do |batch|
      product_params.each do |product|
        product['PlantBatchName'] = batch.metrc_tag
        product['ActualDate'] = DateTime.now.utc.strftime('%Y-%m-%d')
        metrc_params << product
      end
    end

    #push to metrc api here
    MetrcApi.create_additives(facility.site_license, metrc_params)
  end

  private

  def generate_product_params(product, nutrient)
    {
      "AdditiveType": 'Fertilizer',
      "ProductTradeName": product.name,
      "EpaRegistrationNumber": product.epa_number,
      "ProductSupplier": get_supplier_name(product.id),
      # "ApplicationDevice": "GreatDistributor 210lb",
      "TotalAmountApplied": nutrient.amount,
      "TotalAmountUnitOfMeasure": nutrient.amount_uom,
      "ActiveIngredients": generate_active_ingredient_params(product.nutrients),
    }
  end

  def generate_active_ingredient_params(nutrients)
    active_ingredient_params = []
    nutrients.each do |nutrient|
      active_ingredient_params << {
        "Name": nutrient.element,
        "Percentage": nutrient.value,
      }
    end
    active_ingredient_params
  end

  def get_supplier_name(product_id)
    purchase_order_item = Inventory::PurchaseOrderItem.where(product_id: product_id).first
    if purchase_order_item.present?
      return purchase_order_item.purchase_order.vendor.name
    else
      return ''
    end
  end
end

# POST /plantbatches/v1/additives?licenseNumber=123-ABC
# [
#   {
#     "AdditiveType": "Fertilizer",
#     "ProductTradeName": "Wonder Sprout",
#     "EpaRegistrationNumber": null,
#     "ProductSupplier": "G Labs",
#     "ApplicationDevice": "GreatDistributor 210lb",
#     "TotalAmountApplied": 5.0,
#     "TotalAmountUnitOfMeasure": "Gallons",
#     "ActiveIngredients": [
#       {
#         "Name": "Phosphorous",
#         "Percentage": 30.0
#       },
#       {
#         "Name": "Nitrogen",
#         "Percentage": 15.0
#       },
#       {
#         "Name": "Potassium",
#         "Percentage": 15.0
#       }
#     ],
#     "PlantBatchName": "AK-47 Clone 1/31/2017",
#     "ActualDate": "2019-12-15"
#   },
#   {
#     "AdditiveType": "Pesticide",
#     "ProductTradeName": "Pure Triazine",
#     "EpaRegistrationNumber": null,
#     "ProductSupplier": "G Labs",
#     "ApplicationDevice": "GreatDistributor 210lb",
#     "TotalAmountApplied": 5.0,
#     "TotalAmountUnitOfMeasure": "Gallons",
#     "ActiveIngredients": [
#       {
#         "Name": "Phosphorous",
#         "Percentage": 30.0
#       },
#       {
#         "Name": "Nitrogen",
#         "Percentage": 15.0
#       },
#       {
#         "Name": "Potassium",
#         "Percentage": 15.0
#       }
#     ],
#     "PlantBatchName": "AK-47 Clone 1/31/2017",
#     "ActualDate": "2019-12-15"
#   }
# ]

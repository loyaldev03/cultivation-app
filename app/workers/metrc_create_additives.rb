class MetrcCreateAdditives
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(task_id)
    #build params here
    task = Cultivation::Task.find(task_id)
    batch = task.batch
    metrc_batches = Metrc::PlantBatch.where(batch_id: batch.id).to_a
    nutrient_profile = batch.nutrient_profiles.where(task_id: task_id).first
    facility = task.facility
    metrc_params = []
    product_params = []

    nutrient_profile.nutrients.each do |nutrient|
      product = Inventory::Product.find(nutrient.product_id)
      product_params << generate_product_params(product, nutrient)
    end

    product_params.each do |product|
      metrc_batches.each do |metrc_batch|
        product_dup = product.dup
        product_dup[:PlantBatchName] = metrc_batch.metrc_tag
        product_dup[:ActualDate] = DateTime.now.utc.strftime('%Y-%m-%d')
        metrc_params << product_dup
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
      "ProductSupplier": product.manufacturer,
      "ApplicationDevice": 'shovel',
      "TotalAmountApplied": nutrient.amount.to_f,
      "TotalAmountUnitOfMeasure": nutrient.amount_uom,
      "ActiveIngredients": generate_active_ingredient_params(product.nutrients),
    }
  end

  def generate_active_ingredient_params(nutrients)
    active_ingredient_params = []
    nutrients.each do |nutrient|
      next unless nutrient.value.present?
      active_ingredient_params << {
        "Name": nutrient.element.capitalize,
        "Percentage": nutrient.value,
      }
    end
    active_ingredient_params
  end
end

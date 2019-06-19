class MetrcUpdateItemCategoryWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    # Download Unit of Measures (UoM) list from Metrc via API
    results = MetrcApi.get_item_categories
    results.each do |h|
      # Parse downloaded data, and map to local UoM model
      rec = Inventory::ItemCategory.find_or_create_by(
        name: h['Name'],
        product_category_type: h['ProductCategoryType'],
        quantity_type: h['QuantityType'],
      )
      rec.requires_strain = h['RequiresStrain']
      rec.requires_item_brand = h['RequiresItemBrand']
      rec.requires_administration_method = h['RequiresAdministrationMethod']
      rec.requires_unit_cbd_percent = h['RequiresUnitCbdPercent']
      rec.requires_unit_cbd_content = h['RequiresUnitCbdContent']
      rec.requires_unit_thc_percent = h['RequiresUnitThcPercent']
      rec.requires_unit_thc_content = h['RequiresUnitThcContent']
      rec.requires_unit_volume = h['RequiresUnitVolume']
      rec.requires_unit_weight = h['RequiresUnitWeight']
      rec.requires_serving_size = h['RequiresServingSize']
      rec.requires_supply_duration_days = h['RequiresSupplyDurationDays']
      rec.requires_ingredients = h['RequiresIngredients']
      rec.requires_product_photo = h['RequiresProductPhoto']
      rec.can_contain_seeds = h['CanContainSeeds']
      rec.can_be_remediated = h['CanBeRemediated']
      rec.save
    end
  end
end

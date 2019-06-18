class MetrcUpdateItemCategoryWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    # Download Unit of Measures (UoM) list from Metrc via API
    items = MetrcApi.get_item_categories
    items.each do |item|
      # Parse downloaded data, and map to local UoM model
      rec = Inventory::ItemCategory.find_or_create_by(
        name: item['Name'],
        product_category_type: item['ProductCategoryType'],
        quantity_type: item['QuantityType'],
      )
      rec.requires_strain = item['RequiresStrain']
      rec.requires_item_brand = item['RequiresItemBrand']
      rec.requires_administration_method = item['RequiresAdministrationMethod']
      rec.requires_unit_cbd_percent = item['RequiresUnitCbdPercent']
      rec.requires_unit_cbd_content = item['RequiresUnitCbdContent']
      rec.requires_unit_thc_percent = item['RequiresUnitThcPercent']
      rec.requires_unit_thc_content = item['RequiresUnitThcContent']
      rec.requires_unit_volume = item['RequiresUnitVolume']
      rec.requires_unit_weight = item['RequiresUnitWeight']
      rec.requires_serving_size = item['RequiresServingSize']
      rec.requires_supply_duration_days = item['RequiresSupplyDurationDays']
      rec.requires_ingredients = item['RequiresIngredients']
      rec.requires_product_photo = item['RequiresProductPhoto']
      rec.can_contain_seeds = item['CanContainSeeds']
      rec.can_be_remediated = item['CanBeRemediated']
      rec.save!
    end
  end
end

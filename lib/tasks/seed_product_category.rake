desc "Seed product category"
task seed_product_category: :environment  do
  Constants::BUILTIN_PRODUCT_CATEGORIES.each do |category|
    product_category = Inventory::ProductCategory.find_or_create_by(name: category[:name])
    product_category.update(
      name: category[:name],
      quantity_type: category[:quantity_type],
      built_in: category[:built_in],
      is_active: category[:is_active],
      metrc_item_category: category[:name],
      has_children: category[:has_children],
    )
    if category[:package_units].count > 0
      category[:package_units].each do |package|
        package_unit = product_category.package_units.find_or_create_by(value: package[:value], label: package[:value])
        package_unit.update(
          is_active: true,
          quantity_in_uom: 0
        )
      end
    end
  end
  

end
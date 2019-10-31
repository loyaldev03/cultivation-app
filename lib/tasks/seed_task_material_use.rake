desc "Create dummy material use for selected tasks"
task seed_task_material_use: :environment  do
  facility = Facility.find_by(name: 'DEMO F15')
  products = Inventory::Product.all
  batches = Cultivation::Batch.where(facility_id: facility.id)
  batches.each do |batch|
    batch.tasks.each do |task|
      selected = [true, false].sample
      if selected and task.facility_id
        product = products.sample #random between all products
        uom = Common::UnitOfMeasure.where(dimension: product.uom_dimension).sample #random uom
        quantity = rand(1..20)
        task.material_use.build(
          product_id: product.id,
          quantity: quantity,
          uom: uom,
          catalogue: product.catalogue.key,
        )
        task.save
      end
    end
  end
end

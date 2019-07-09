class GenerateItemFromPackageplan
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id)
    @batch_id = batch_id
    # get list of ProductType Plan by batch_id
    product_plan_items = Inventory::QueryProductPackagePlans.call(
      batch_id: @batch_id.to_bson_id,
    )

    if product_plan_items.any
      product_plan_items.each do |p|
        item_name = "#{p.product_type} - #{p.strain} - #{p.no} - #{p.harvest_name}"
        item = Inventory::Item.find_or_initialize_by(
          name: item_name,
          product_category_name: p.product_type,
          uom_name: p.product_uom,
          strain_name: p.strain,
        )
        logger.debug "\033[31m >>> >>> \033[0m"
        logger.debug item
        logger.debug "\033[31m <<< <<< \033[0m"
      end
    end

    # get list of Items for batch_id
    # generate item from each plan, no duplicate
    logger.debug 'Perform GenerateItemFromPackageplan'
    logger.debug "\033[31m ID: #{batch.name} \033[0m"
  end

  private

  def batch
    @batch ||= Cultivation::Batch.find(@batch_id)
  end
end

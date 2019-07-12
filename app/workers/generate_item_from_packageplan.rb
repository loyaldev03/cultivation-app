class GenerateItemFromPackageplan
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(batch_id)
    @batch_id = batch_id
    # get list of ProductType Plan by batch_id
    product_plan_items = Inventory::QueryProductPackagePlans.call(
      batch_id: batch_id.to_bson_id,
    ).result

    # mark existing batch items as deleted
    Inventory::Item.where(
      batch_id: @batch_id,
      is_used: false,
    ).update_all(deleted: true)

    # loop through each plan item and convert them into metrc item
    if !product_plan_items.blank?
      product_plan_items.each do |p|
        position = '%02d' % p.position.next
        item_name = "#{p.product_category} - #{p.strain_name}"
        item_name += " - #{p.harvest_name} - #{position}"
        uom_name = get_harvest_uom_name(p.harvest_name)
        item = Inventory::Item.find_or_initialize_by(
          name: item_name,
          uom_name: uom_name,
        )
        item.product_category_name = p.product_category
        item.strain_name = p.strain_name
        item.batch_id = batch.id
        item.facility_id = batch.facility_id
        item.deleted = false
        item.save!
      end
    end

    # mark existing batch items as deleted
    Inventory::Item.
      where(batch_id: @batch_id, metrc_id: nil, deleted: true).
      delete_all

    # TODO: deleted items with metrc_id would be deleted by metrc update worker
    # once it deleted, the record from metrc.
  end

  private

  def batch
    @batch ||= Cultivation::Batch.find(@batch_id)
  end

  def get_harvest_uom_name(name)
    harvest_batch = Inventory::HarvestBatch.find_by(
      harvest_name: name,
      cultivation_batch: batch,
    )
    get_uom_name_by_unit(harvest_batch.uom)
  end

  def get_uom_name_by_unit(unit)
    unit_of_measure = Common::UnitOfMeasure.find_by(unit: unit)
    unit_of_measure&.name
  end
end

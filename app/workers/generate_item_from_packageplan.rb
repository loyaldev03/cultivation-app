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
    Inventory::Item.where(batch_id: @batch_id).update_all(deleted: true)

    # loop through each plan item and convert them into metrc item
    if !product_plan_items.blank?
      product_plan_items.each do |p|
        item_name = "#{p.product_category} - #{p.strain_name}"
        item_name += " - #{p.harvest_name} - #{p.position}"
        item = Inventory::Item.find_or_initialize_by(
          product_category_name: p.product_category,
          uom_name: p.product_uom,
          strain_name: p.strain_name,
          batch_id: batch.id,
          facility_id: batch.facility_id,
        )
        item.name = item_name
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
end

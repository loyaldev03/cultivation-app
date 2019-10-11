class DestroyFacility
  prepend SimpleCommand

  def initialize(current_user, record_id)
    @current_user = current_user
    if record_id.nil?
      raise 'Invalid record id'
    else
      @record_id = record_id
    end
  end

  def call
    @facility = Facility.find(@record_id)
    #if !@facility.is_enabled?
    batches = Cultivation::Batch.where(facility_id: @record_id)
    delete_batches(batches.pluck(:id))
    batches.delete_all
    Inventory::FacilityStrain.delete_all(facility_id: @record_id)
    Inventory::Plant.delete_all(facility_id: @record_id)
    Inventory::MetrcTag.delete_all(facility_id: @record_id)
    Inventory::ItemTransaction.delete_all(facility_id: @record_id)
    #Cultivation::TrayPlan.delete_all(facility: @record_id)
    #Cultivation::Task.delete_all(facility_id: @record_id)
    #Inventory::HarvestBatch.delete_all(facility_id: @record_id)
    Inventory::Item.delete_all(facility_id: @record_id)
    Inventory::Product.delete_all(facility_id: @record_id)
    purchase_orders = Inventory::PurchaseOrder.where(facility_id: @record_id)
    Inventory::PurchaseOrderItem.in(purchase_order_id: purchase_orders.pluck(:id)).delete_all
    purchase_orders.delete_all
    invoices = Inventory::VendorInvoice.in(facility_id: @record_id)
    Inventory::VendorInvoiceItem.in(invoice_id: invoices.pluck(:id)).delete_all
    invoices.delete_all
    MetrcHistory.delete_all(facility_id: @record_id)
    @facility.delete

    @record_id
    #else
    # errors.add(:facility, 'Unable to delete active facility')
    #end
  end

  def delete_batches(batches)
    if batches.any?
      Cultivation::Task.in(batch_id: batches).delete_all
      Cultivation::TrayPlan.in(batch_id: batches).delete_all
      Cultivation::ProductTypePlan.in(batch_id: batches).delete_all
      Issues::Issue.in(cultivation_batch_id: batches).delete_all
      Inventory::HarvestBatch.in(cultivation_batch_id: batches).delete_all
      Inventory::ItemTransaction.in(cultivation_batch_id: batches).delete_all
      Inventory::Plant.in(cultivation_batch_id: batches).delete_all
      Notification.in(notifiable_id: batches).delete_all
      Notification.in(alt_notifiable_id: batches).delete_all
    end
  end
end

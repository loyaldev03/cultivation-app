##
# This query is optimise for & tightly coupled with with RawMaterialsSerializer.
#
module Inventory
  class QueryRawMaterialWithRelationships
    prepend SimpleCommand

    attr_reader :id, :type, :event_types, :facility_id

    def initialize(type:, id:, event_types:, facility_id:)
      @type = type
      @id = id.blank? ? nil : BSON::ObjectId(id)
      @event_types = event_types
      @facility_id = facility_id
    end

    def call
      if id.nil?
        retrieve_collection
      else
        retrieve_one
      end
    end

    # TODO: Change this to $aggregate and $unwrap to reduce number of N + 1 query
    def retrieve_collection
      special_type = ['seeds', 'purchased_clones']

      if (special_type.include?(type))
        raw_material_ids = Inventory::Catalogue.raw_materials.where(
          :uom_dimension.nin => [nil, ''],
          key: type,
        ).pluck(:id)
      else
        raw_material_ids = Inventory::Catalogue.raw_materials.where(
          :uom_dimension.nin => [nil, ''],
          category: type,
        ).pluck(:id)
      end

      item_transactions = Inventory::ItemTransaction.includes(:catalogue, :facility, :facility_strain).where(
        :facility_id => @facility_id,
        :event_type.in => @event_types,
        :catalogue_id.in => raw_material_ids,
      ).order(c_at: :desc)

      vi_item_ids = item_transactions.where(ref_type: 'Inventory::VendorInvoiceItem').pluck(:ref_id)
      vendor_invoice_items = Inventory::VendorInvoiceItem.includes(
        :invoice, {invoice: :purchase_order, invoice: :vendor}
      ).in(id: vi_item_ids)

      {
        item_transactions: item_transactions,
        vendor_invoice_items: vendor_invoice_items.to_a,
      }
    end

    def retrieve_one
      item_transaction = Inventory::ItemTransaction.includes(:catalogue, :facility, :facility_strain).find_by(
        id: id,
        :event_type.in => @event_types,
      )

      vendor_invoice_items = if item_transaction.ref_type == 'Inventory::VendorInvoiceItem'
                               Inventory::VendorInvoiceItem.includes(:invoice, {invoice: :purchase_order, invoice: :vendor})
                                 .find_by(id: item_transaction.ref_id)
                             else
                               []
                             end
      {
        item_transactions: item_transaction,
        vendor_invoice_items: vendor_invoice_items.to_a,
      }
    end
  end
end

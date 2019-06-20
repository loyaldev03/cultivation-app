##
# This query is optimise for & tightly coupled with with RawMaterialsSerializer.
#
module Inventory
  class QueryRawMaterialWithRelationships
    prepend SimpleCommand

    attr_reader :id, :type, :event_types, :facility_id

    def initialize(type:, id:, event_types:, facility_id:)
      @type = type
      @id = id&.to_bson_id
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

      #same as query in products index, query_raw_material_with_relationship, should move to cmd ?
      special_type = ['seeds', 'purchased_clones']
      raw_material_ids = if special_type.include?(type)
                           #find parent only one
                           Inventory::Catalogue.raw_materials.where(
                             key: type,
                           ).pluck(:id)
                         else
                           #find catalogue for other than parent, parent will never have category type
                           Inventory::Catalogue.raw_materials.where(
                             category: type,
                           ).pluck(:id)
                         end

      item_transactions = Inventory::ItemTransaction.includes(:catalogue, :facility, :facility_strain).where(
        :facility_id => @facility_id,
        :event_type.in => @event_types,
        :catalogue_id.in => raw_material_ids,
      ).order(c_at: :desc)

      vi_item_ids = item_transactions.
        where(ref_type: 'Inventory::VendorInvoiceItem').pluck(:ref_id)
      vendor_invoice_items = Inventory::VendorInvoiceItem.
        includes(:invoice).
        in(id: vi_item_ids)

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
                               Inventory::VendorInvoiceItem.
                                 includes(:invoice).
                                 find_by(id: item_transaction.ref_id)
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

module Inventory
  class QueryNonSalesItems
    prepend SimpleCommand

    attr_reader :id, :type, :event_types

    def initialize(type:, id:, event_types:)
      @type = type
      @id = id.blank? ? nil : BSON::ObjectId(id)
      @event_types = event_types
    end

    def call
      if id.nil?
        retrieve_collection
      else
        retrieve_one
      end
    end

    def retrieve_collection
      ## TODO: Retrieve Collection query for non sales items
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

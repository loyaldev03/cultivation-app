####################################################################
# This command is for creating invoice when setting up inventory.
# It creates and invoice with items, item articles related to this
# invoice w/o amount. -- to be changed as needed ---
#
# If invoice no already exist, only new items & item articles will appended.
####################################################################
module Inventory
  class SaveBlankInvoice
    prepend SimpleCommand

    attr_reader :items, :item_articles, :plants, :vendor, :invoice_no

    def initialize(items, item_articles, vendor, invoice_no)
      if items.nil?
        @items = item_articles.map(&:item_id)
      else
        @items = *items.map { |x| x.id.to_s }
      end

      @item_articles = item_articles.map { |x| x.id.to_s }
      @vendor = vendor
      @invoice_no = invoice_no
    end

    def call
      invoice = Inventory::VendorInvoice.find_or_create_by(vendor: vendor, invoice_no: invoice_no)
      invoice.items = (invoice.items || [] + items).uniq  # for now just store item related to this invoice
      # here first until we figure out how to add item pricing.

      invoice.item_articles = (invoice.item_articles || [] + item_articles).uniq
      invoice.status = 'old_invoice'
      invoice.total_amount = 0
      if !invoice.save
        invoice.errors.each { |field, message| errors.add(field, "#{field.to_s.titleize} #{message}") }
      end

      invoice
    end
  end
end

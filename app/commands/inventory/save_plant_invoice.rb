####################################################################
# This command is for creating invoice when setting up inventory.
# It creates and invoice with items, item articles related to this
# invoice w/o amount. -- to be changed as needed ---
#
# If invoice no already exist, only new items & item articles will appended.
####################################################################
module Inventory
  class SavePlantInvoice
    prepend SimpleCommand

    attr_reader :plants,
      :vendor,
      :invoice_no,
      :invoice_date,
      :purchase_order_no

    def initialize(user, plants, vendor, invoice_no, invoice_date, purchase_order_no)
      @user = user
      @plants = plants
      @vendor = vendor
      @invoice_no = invoice_no
      @invoice_date = invoice_date
      @purchase_order_no = purchase_order_no
    end

    def call
      Rails.logger.debug "\t\t\t>>> SavePlantInvoice vendor: #{vendor}"
      invoice = Inventory::VendorInvoice.find_or_create_by!(vendor: vendor, invoice_no: invoice_no)
      invoice.invoice_date = invoice_date
      # invoice.purchase_order_no = purchase_order_no
      invoice.plants.concat(plants)
      invoice.save!
      invoice
    end
  end
end

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

    attr_reader :plants, :vendor, :invoice_no, :purchase_date

    def initialize(user, plants, vendor, invoice_no, purchase_date)
      @user = user
      @plants = plants
      @vendor = vendor
      @invoice_no = invoice_no
      @purchase_date = purchase_date
    end

    def call
      invoice = Inventory::VendorInvoice.find_or_create_by!(
        vendor: vendor,
        invoice_no: invoice_no,
      )

      invoice.purchase_date = purchase_date

      plants.each do |plant|
        plant.origin_id = invoice.id
        plant.origin_type = 'Inventory::Invoice'
        plant.save!
      end

      invoice
    end
  end
end

module Inventory
  class CalculateAverageProductPrice
    prepend SimpleCommand
    attr_reader :product_id

    def initialize(product_id)
      @product_id = product_id
    end

    def call
      product = Inventory::Product.find(product_id)
      vendor_invoice_items = Inventory::VendorInvoiceItem.where(
        product_name: product.name,
        product_id: product.id,
      )
      return unless vendor_invoice_items.present?

      total_quantity = 0
      total_amount = 0
      vendor_invoice_items.each do |vii|
        item_transaction = Inventory::ItemTransaction.find_by(ref_type: 'Inventory::VendorInvoiceItem', ref_id: vii.id)
        # TODO: find out why common_quantity is broken
        total_quantity += item_transaction.quantity
        total_amount += vii.total_amount
      end

      update_average_price(product, total_amount, total_quantity)
    end

    private

    def update_average_price(product, total_amount, total_quantity)
      average_price = total_amount / total_quantity
      product.average_price = average_price
      product.save
    end
  end
end

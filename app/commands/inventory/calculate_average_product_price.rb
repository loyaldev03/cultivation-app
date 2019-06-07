module Inventory
  class CalculateAverageProductPrice
    prepend SimpleCommand
    attr_reader :current_user, :invoice_item_id, :current_invoice_item

    def initialize(current_user, invoice_item_id)
      @current_user = current_user
      @current_invoice_item = Inventory::InvoiceItem.find_by invoice_item_id
    end

    # To get average price of products
    # On save inventory setup.
    #    -> for each invoice of the product,
    #
    #   -> if convert the product purchase quantity to based unit
    #   -> get total price = quantity * price * (1 + tax)
    #   -> price per unit = total price / quantity

    # def calculate_average_price
    #   vi = Inventory::VendorInvoiceItem.where(product_id: p.id)
    #   qty = vi.quantity
    #   price = vi.price
    #   uom = vi.uom

    #   uom_qty = uom.conver .... qty, uom
    #   total_cost = qty * price
    #   average_cost_per_std_qty = total_cost / uom_qty
    #   average all average prices?
    # end

    def call
      product_id = current_invoice_item.product_id
      invoice_items = Inventory::VendorInvoiceItem.where(product_id: product_id)
      total_qty = 0
      invoice_items.each do |vi|
        # InvoiceItem quantity is input quantity which could be another UOM.
        # In order to get common_quantity, better take from ItemTransaction
        tx = Inventory::ItemTransaction.find_by(ref_type: 'Inventory::VendorInvoiceItem', ref_id: vi.id)
        total_qty += vi.quantity
        total_amount += (vi.price * (1.0 + vi.tax) * vi.quantity)
      end

      average_price = total_amount / total_qty
      product = Inventory::Product.find(product_id)
      product.average_price = average_price
      average_price
    end
  end
end

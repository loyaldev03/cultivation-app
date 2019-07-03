require "rails_helper"

RSpec.describe Inventory::CalculateAverageProductPrice, type: :command do
  let(:catalogue) { create(:catalogue) }
  let(:facility) { create(:facility) }
  let(:product) { create(:product, catalogue: catalogue, facility: facility) }
  let(:invoice_item1) { double(id: '1', total_amount: 100) } # quantity 10, price per-item 10
  let(:item_transaction1) { double(quantity: 100) } # quantity 10, amount material per-quantity 10

  let(:invoice_items) do
    [invoice_item1]
  end

  let(:expected_average_price) { 1.0 }

  describe ".call" do
    context 'when only 1 transaction' do
      before do
        allow(Inventory::VendorInvoiceItem).to receive(:where).with(product_name: product.name, product_id: product.id).and_return(invoice_items)
        allow(Inventory::ItemTransaction).to receive(:find_by).with(ref_type: 'Inventory::VendorInvoiceItem', ref_id: invoice_item1.id).and_return(item_transaction1)
      end

      it 'calculates and set average price of product' do
        cmd = Inventory::CalculateAverageProductPrice.call(product.id)
        expect(cmd.success?).to eq true
        expect(product.reload.average_price).to eq(expected_average_price)
      end
    end

    context 'when there are more than 1 transactions' do
      let(:invoice_item2) { double(id: '2', total_amount: 1000) } # quantity 10, price per-item 100
      let(:item_transaction2) { double(quantity: 10) } # quantity 10, amount material per-quantity 1
      let(:invoice_items) { [invoice_item1, invoice_item2] }

      let(:expected_average_price) { 10.0 } # total amount 1100. total quantity 110

      before do
        allow(Inventory::VendorInvoiceItem).to receive(:where).with(product_name: product.name, product_id: product.id).and_return(invoice_items)
        allow(Inventory::ItemTransaction).to receive(:find_by).with(ref_type: 'Inventory::VendorInvoiceItem', ref_id: invoice_item1.id).and_return(item_transaction1)
        allow(Inventory::ItemTransaction).to receive(:find_by).with(ref_type: 'Inventory::VendorInvoiceItem', ref_id: invoice_item2.id).and_return(item_transaction2)
      end

      it 'calculates and set average price of product' do
        cmd = Inventory::CalculateAverageProductPrice.call(product.id)
        expect(cmd.success?).to eq true
        expect(product.reload.average_price).to eq(expected_average_price)
      end
    end
  end
end

require "rails_helper"

RSpec::Expectations.configuration.on_potential_false_positives = :nothing
RSpec.describe Inventory::ConvertPackageFromScan, type: :command do
  let(:task) { create(:task, actual_labor_cost: 100, actual_material_cost: 100) }
  let(:facility) { create(:facility) }
  let(:metrc_tag) { create(:metrc_tag, facility: facility) }
  let(:catalogue) { create(:catalogue, category: 'raw_sales_product') }
  let(:source_package) { create(:item_transaction, catalogue: catalogue, facility: facility) }
  let(:user) { double('user') }
  let(:args) do
    {
      task_id: task.id,
      source_package_id: source_package.id,
      product_type: catalogue.label,
      package_type: '1/2 GRAM',
      tag: metrc_tag.tag
    }
  end

  # Not really sure about the calculation
  let(:expected_production_cost) { 200.25 }

  describe '.call' do
    context 'when invalid params' do
      [:task_id, :source_package_id, :product_type, :package_type, :tag].each do |param|
        before { args.delete(param) }
        context "and missing #{param}" do
          it 'raises an error' do
            expect { Inventory::ConvertPackageFromScan.call(user, args) }.to raise_error
          end
        end
      end
    end

    context 'when valid params' do
      context 'and missing catalogue' do
        before { args[:product_type] = 'random_catalog' }

        it 'raises an error' do
          expect { Inventory::ConvertPackageFromScan.call(user, args) }.to raise_error
        end
      end

      context 'and missing size' do
        before { args[:package_type] = '' }

        it 'raises an error' do
          expect { Inventory::ConvertPackageFromScan.call(user, args) }.to raise_error
        end
      end

      context 'when invalid data' do
        context 'and metrc_tag is nil' do
          before { args[:tag] = '' }

          it'returns an error' do
            cmd = Inventory::ConvertPackageFromScan.call(user, args)
            expect(cmd.success?).to eq(false)
            expect(cmd.errors).to eq(package_tag: ['METRC tag not exists'])
          end
        end

        context 'and metrc_tags status is not available' do
          let(:metrc_tag) { create(:metrc_tag, facility: facility, status: 'assigned') }

          it'returns an error' do
            cmd = Inventory::ConvertPackageFromScan.call(user, args)
            expect(cmd.success?).to eq(false)
            expect(cmd.errors).to eq(package_tag: ['METRC tag already assigend'])
          end
        end
      end

      it 'creates or update product' do
        expect { Inventory::ConvertPackageFromScan.call(user, args) }.to change { Inventory::Product.count }.from(0).to(1)
      end

      it 'creates package' do
        expect { Inventory::ConvertPackageFromScan.call(user, args) }.to change { Inventory::ItemTransaction.count }
      end

      it 'creates deduction event type of item transaction' do
        expect { Inventory::ConvertPackageFromScan.call(user, args) }.to change { Inventory::ItemTransaction.where(event_type: 'deduction_of_convert_package_from_scan').count }
      end

      it 'sets metrc_tag to assigend' do
        cmd = Inventory::ConvertPackageFromScan.call(user, args)
        expect(cmd.success?).to eq(true)
        expect(metrc_tag.reload.status).to eq('assigned')
      end

      it 'sets the production cost of the package' do
        cmd = Inventory::ConvertPackageFromScan.call(user, args)
        package = Inventory::ItemTransaction.where(event_type: 'convert_package_from_scan').last

        expect(cmd.success?).to eq(true)
        expect(package.production_cost).to eq(expected_production_cost)
      end
    end
  end
end

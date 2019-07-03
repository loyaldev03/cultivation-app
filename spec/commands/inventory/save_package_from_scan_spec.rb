require "rails_helper"

RSpec::Expectations.configuration.on_potential_false_positives = :nothing
RSpec.describe Inventory::SavePackageFromScan, type: :command do
  let(:facility) { create(:facility) }
  let(:facility_strain) { create(:facility_strain, facility: facility) }
  let(:metrc_tag) { create(:metrc_tag, facility: facility) }
  let(:catalogue) { create(:catalogue, category: 'raw_sales_product') }
  let(:cultivation_batch) { create(:batch, facility: facility, facility_strain: facility_strain, actual_labor_cost: 100, actual_material_cost: 100) }
  let!(:harvest_batch) { create(:harvest_batch, cultivation_batch: cultivation_batch, facility_strain: facility_strain, total_cure_weight: 5) }

  let(:user) { double('user') }
  let(:args) do
    {
      cultivation_batch_id: cultivation_batch.id,
      product_type: catalogue.label,
      package_type: '1/2 GRAM',
      tag: metrc_tag.tag
    }
  end

  # actual cost: 200 / 5  (total_cure_weight) and times 0.005 (common_quantity)
  let(:expected_production_cost) { 0.02 }

  describe '.call' do
    context 'when invalid params' do
      [:cultivation_batch_id, :product_type, :package_type, :tag].each do |param|
        before { args.delete(param) }
        context "and missing #{param}" do
          it 'raises an error' do
            expect { Inventory::SavePackageFromScan.call(user, args) }.to raise_error
          end
        end
      end
    end

    context 'when valid params' do
      context 'and missing catalogue' do
        before { args[:product_type] = 'random_catalog' }

        it 'raises an error' do
          expect { Inventory::SavePackageFromScan.call(user, args) }.to raise_error
        end
      end

      context 'and missing size' do
        before { args[:package_type] = '' }

        it 'raises an error' do
          expect { Inventory::SavePackageFromScan.call(user, args) }.to raise_error
        end
      end

      context 'when invalid data' do
        context 'and metrc_tag is nil' do
          before { args[:tag] = '' }

          it'returns an error' do
            cmd = Inventory::SavePackageFromScan.call(user, args)
            expect(cmd.success?).to eq(false)
            expect(cmd.errors).to eq(package_tag: ['METRC tag not exists'])
          end
        end

        context 'and metrc_tags status is not available' do
          let(:metrc_tag) { create(:metrc_tag, facility: facility, status: 'assigned') }

          it'returns an error' do
            cmd = Inventory::SavePackageFromScan.call(user, args)
            expect(cmd.success?).to eq(false)
            expect(cmd.errors).to eq(package_tag: ['METRC tag already assigend'])
          end
        end
      end

      it 'creates or update product' do
        expect { Inventory::SavePackageFromScan.call(user, args) }.to change { Inventory::Product.count }.from(0).to(1)
      end

      it 'creates package' do
        expect { Inventory::SavePackageFromScan.call(user, args) }.to change { Inventory::ItemTransaction.count }
      end

      it 'sets metrc_tag to assigend' do
        cmd = Inventory::SavePackageFromScan.call(user, args)
        expect(cmd.success?).to eq(true)
        expect(metrc_tag.reload.status).to eq('assigned')
      end

      it 'sets the production cost on the ItemTransaction' do
        cmd = Inventory::SavePackageFromScan.call(user, args)
        package = Inventory::ItemTransaction.where(event_type: 'create_package_from_scan').last

        expect(cmd.success?).to eq(true)
        expect(package.production_cost).to eq(expected_production_cost)
      end
    end
  end
end

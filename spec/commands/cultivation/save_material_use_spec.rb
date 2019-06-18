require 'rails_helper'

RSpec.describe Cultivation::SaveMaterialUse, type: :command do
  let(:facility) { create(:facility, :is_complete) }
  let(:strain) { create(:facility_strain, facility: facility) }
  let(:start_date) { Time.zone.parse("01/01/2019") }
  let(:batch) { create(:batch, facility_id: facility.id, facility_strain: strain, start_date: start_date) }

  let(:user) { double('user') }
  let(:task_estimated_cost) { 50 }
  let(:task) { create(:task, batch: batch, estimated_labor_cost: task_estimated_cost) }
  let(:id) { task.id }

  let(:catalogue) { create(:catalogue) }
  let(:product_1) { create(:product, catalogue: catalogue, facility: facility, average_price: 10) }
  let(:item_1) do
    {
      product_id: product_1.id,
      quantity: 1,
      uom: 'pc'
    }
  end
  let(:product_2) { create(:product, catalogue: catalogue, facility: facility, average_price: 5) }
  let(:item_2) do
    {
      product_id: product_2.id,
      quantity: 1,
      uom: 'pc'
    }
  end

  let(:items) { [item_1, item_2] }
  let(:water_ph) { 1 }

  let(:expected_material_use_count) { 2 }
  let(:expected_estimated_material_cost) { 15 } # item1: (1 * 10) + Item2: (1 * 5) = 15
  let(:expected_batch_estimated_cost) { 65 } # estimated_material_cost (15) + task_estimated_cost (50)

  describe '.call' do
    it 'updates task with material use' do
      cmd =  Cultivation::SaveMaterialUse.call(user, id, items, water_ph)

      task.reload
      expect(cmd.success?).to eq true
      expect(task.water_ph).to eq(water_ph)
      expect(task.material_use.count).to eq(expected_material_use_count)
    end

    it 'updates the estimated material cost of the task' do
      cmd =  Cultivation::SaveMaterialUse.call(user, id, items, water_ph)

      task.reload
      expect(cmd.success?).to eq true
      expect(task.estimated_material_cost).to eq(expected_estimated_material_cost)
    end

    it 'updates the estimated cost of the batch' do
      cmd =  Cultivation::SaveMaterialUse.call(user, id, items, water_ph)

      batch.reload
      expect(cmd.success?).to eq true
      expect(batch.estimated_cost).to eq(expected_batch_estimated_cost)
    end
  end
end

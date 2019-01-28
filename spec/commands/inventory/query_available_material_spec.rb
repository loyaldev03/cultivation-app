require "rails_helper"

RSpec.describe Inventory::QueryAvailableMaterial, type: :command do
  let(:strain) { Common::Strain.create!(name: 'xyz', strain_type: 'indica') }
  let(:facility) do
    facility = create(:facility, :is_complete)
    facility.rooms.each do |room|
      room.rows.each do |row|
        row.shelves.each do |shelf|
          shelf.trays.each(&:save!)
        end
      end
    end
    facility
  end

  let!(:facility_strain) {
    create(:facility_strain, facility: facility)
  }

  let!(:catalogue) do 
    create(:catalogue)
  end

  let!(:product) do
    create(:product, catalogue: catalogue, facility: facility, facility_strain: facility_strain)
  end

  let!(:package) do
    package = product.packages.new(product_name: product.name, quantity: 30, catalogue_id: catalogue.id, facility_id: facility.id, facility_strain_id: facility_strain.id)
    package.save
  end

  let(:current_user) { create(:user, facilities: [facility.id]) }
  let!(:batch1) do
    start_date = Time.zone.parse("01/01/2019").beginning_of_day
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: 'purchased_clones')
  end

  let!(:task_1) do 
    task = batch1.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "plants" })
    task.material_use.new({
      quantity: 10,
      catalogue: catalogue,
      product: product
    })
    task.save
    task
  end

  let!(:batch2) do
    start_date = Time.zone.parse("01/02/2019").beginning_of_day
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: 'purchased_clones')
  end

  let!(:task_2) do 
    task = batch2.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "plants" })
    task.material_use.new({
      quantity: 10,
      catalogue: catalogue,
      product: product
    })
    task.save
    task
  end

  let!(:batch3) do
    start_date = Time.zone.parse("01/03/2019").beginning_of_day
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: 'purchased_clones')
  end

  let!(:task_3) do 
    task = batch3.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "plants" })
    task.material_use.new({
      quantity: 10,
      catalogue: catalogue,
      product: product
    })
    task.save
    task
  end

  context ".call" , focus: true do
    it "return correct material available" do
      batches_selected = Cultivation::Batch
                    .where(:start_date.gte => Time.now)
                    .where(:status.in =>  [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE])
                    .not_in(id: batch1.id) #not draft => schedule and active
      plant_task = batch1.tasks.detect { |a| a['indelible'] == 'plants' }

      material = plant_task.material_use.first
      result = Inventory::QueryAvailableMaterial.call(material.product_id, batches_selected.pluck(:id)).result
      expect(result[:material_available]).to eq 30
    end

    it "return correct material booked" do
      batches_selected = Cultivation::Batch
                    .where(:start_date.gte => Time.now)
                    .where(:status.in =>  [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_ACTIVE])
                    .not_in(id: batch1.id) #not draft => schedule and active
      plant_task = batch1.tasks.detect { |a| a['indelible'] == 'plants' }

      material = plant_task.material_use.first
      result = Inventory::QueryAvailableMaterial.call(material.product_id, batches_selected.pluck(:id)).result
      expect(result[:material_booked]).to eq 20
    end
  end
end

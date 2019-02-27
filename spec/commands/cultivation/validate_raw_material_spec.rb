require "rails_helper"

RSpec.describe Cultivation::ValidateRawMaterial, type: :command do
  let(:uom) {SeedUnitOfMeasure.call}
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
    package = product.packages.new(product_name: product.name, quantity: 30, uom:  'kg', catalogue_id: catalogue.id, facility_id: facility.id, facility_strain_id: facility_strain.id)
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
          batch_source: Constants::SEEDS_KEY)
  end

  let!(:task_1) do 
    task = batch1.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "" })
    task.material_use.new({
      quantity: 40,
      uom:  'kg',
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
          batch_source: Constants::SEEDS_KEY)
  end

  let!(:task_2) do 
    task = batch2.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "" })
    task.material_use.new({
      quantity: 10,
      uom:  'kg',
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
          batch_source: Constants::SEEDS_KEY)
  end

  let!(:task_3) do 
    task = batch3.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "" })
    task.material_use.new({
      quantity: 10,
      uom:  'kg',
      product: product
    })
    task.save
    task
  end

  context ".call" do
    it "return error if raw material is insufficient" do
      result = Cultivation::ValidateRawMaterial.call(current_user: current_user, batch_id: batch1.id)
      expect(result.success?).to be false
      expect(result.errors['strain'].count).to be > 0
      expect(result.errors['strain'][0]).to eq('Insufficient Raw Material')
    end

    it "check issues created" do
      result = Cultivation::ValidateRawMaterial.call(current_user: current_user, batch_id: batch1.id)
      issues = Issues::Issue.all
      expect(result.success?).to be false
      expect(issues.count).to be 1
      expect(issues.first.task_id.to_s).to eq(task_1.id.to_s)
    end

    it "return no error if material is added sufficient stock" do
      package = product.packages.new(product_name: product.name, quantity: 30, uom:  'kg', catalogue_id: catalogue.id, facility_id: facility.id, facility_strain_id: facility_strain.id)
      package.save
      result = Cultivation::ValidateRawMaterial.call(current_user: current_user, batch_id: batch1.id)
      issues = Issues::Issue.all
      expect(result.success?).to be true
      expect(issues.count).to be 0
      expect(result.errors).to be_empty
    end

  end
end

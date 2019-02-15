require "rails_helper"

RSpec.describe Cultivation::ValidateSeed, type: :command do
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
    start_date = Time.now.beginning_of_day
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: Constants::SEEDS_KEY)
  end

  let!(:task_1) do 
    task = batch1.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "plants" })
    task.save
    task
  end

  let!(:batch2) do
    start_date = Time.now.beginning_of_day + 1.month
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: Constants::SEEDS_KEY)
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
    start_date = Time.now.beginning_of_day + 2.month
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: Constants::SEEDS_KEY)
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

  context ".call" do
    it "return error if no seed selected" do
      result = Cultivation::ValidateSeed.call(current_user: current_user, batch_id: batch1.id)
      expect(result.success?).to be false
      expect(result.errors['strain'].count).to be > 0
      expect(result.errors['strain'][0]).to eq('Seed is not selected')
    end

    it "return nothing if seed selected" do
      task = batch1.tasks.first
      task.material_use.new({
        quantity: 10,
        catalogue: catalogue,
        product: product
      })
      task.save
      result = Cultivation::ValidateSeed.call(current_user: current_user, batch_id: batch1.id)
      expect(result.success?).to be true
      expect(result.errors['strain']).to be nil
    end

    it "return error if seed is insufficient" do
      task = batch1.tasks.first
      task.material_use.new({
        quantity: 11,
        catalogue: catalogue,
        product: product
      })
      task.save
      result = Cultivation::ValidateSeed.call(current_user: current_user, batch_id: batch1.id)
      expect(result.success?).to be false
      expect(result.errors['strain'].count).to be > 0
      expect(result.errors['strain'][0]).to start_with('Insufficient Seed')
    end

  end
end

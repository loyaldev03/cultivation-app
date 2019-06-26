require "rails_helper"

RSpec.describe Cultivation::ValidateResource, type: :command do
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
    task = batch1.tasks.create!({ 
      wbs: "1.1.1", 
      phase: "clone", 
      name: "Select clones or seeds", 
      duration: "", 
      indelible: "plants", 
      estimated_hours: 20.0,
      facility: facility, 
    })
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
    task = batch2.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "plants" })
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
    task = batch3.tasks.new({ "wbs": "1.1.1", "phase": "clone", "name": "Select clones or seeds", "duration": "", "indelible": "plants" })
    task.material_use.new({
      quantity: 10,
      uom:  'kg',
      product: product
    })
    task.save
    task
  end

  context ".call" do
    it "return error if estimated hours available but no user assigned" do
      result = Cultivation::ValidateResource.call(current_user: current_user, batch_id: batch1.id)
      
      expect(result.success?).to be false
      expect(result.errors['resource'].count).to be > 0
      pp result.errors['resource']
      expect(result.errors['resource']).to include("Task #{task_1.name} is unassigned.")
    end

    it "return error if user assigned with over working hours" do
      task_1.update(user_ids: [current_user.id]) #assign user
      result = Cultivation::ValidateResource.call(current_user: current_user, batch_id: batch1.id)
      expect(result.success?).to be false
      expect(result.errors['resource'].count).to be > 0
      expect(result.errors['resource']).to include('Resource overallocation')
    end

  end
end

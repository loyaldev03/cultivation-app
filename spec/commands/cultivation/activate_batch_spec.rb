require "rails_helper"

RSpec.describe Cultivation::ActivateBatch, type: :command do
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
    Time.zone = facility.timezone
    start_date = Time.zone.now.beginning_of_day
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: Constants::PURCHASED_CLONES_KEY)
  end

  context ".call" do
    it "Activate batch on start date" do
      Time.use_zone(facility.timezone) do
        Cultivation::ActivateBatch.call(Time.now)

        result = Cultivation::Batch.find(batch1.id)
        expect(result.status).to eq 'ACTIVE'
        expect(result.current_growth_stage).to eq 'clone'
      end
    end
  end

end
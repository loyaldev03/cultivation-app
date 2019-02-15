require "rails_helper"

RSpec.describe Cultivation::ActivateBatch, type: :command do
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
    start_date = Time.zone.now.beginning_of_day
    create(:batch, :scheduled,
          facility_strain: facility_strain,
          facility: facility,
          start_date: start_date,
          quantity: 10,
          batch_source: Constants::PURCHASED_CLONES_KEY)
  end

  context ".call" do
    it "return Scheduled status if not same timezone" do
      timezones = TZInfo::Timezone.all.map {|a| a.name}
      timezones.delete(facility.timezone) #exclude facility timezone from list
      Time.zone = timezones.sample
      start_date = Time.zone.now.beginning_of_day
      batch1.update(start_date: start_date)

      result = Cultivation::ActivateBatch.call
      expect(Cultivation::Batch.first.status).to eq 'SCHEDULED'
    end
    it "return Active status if same timezone" do
      Time.zone = facility.timezone
      start_date = Time.zone.now.beginning_of_day
      batch1.update(start_date: start_date)

      result = Cultivation::ActivateBatch.call
      expect(Cultivation::Batch.first.status).to eq 'ACTIVE'
    end
  end

end
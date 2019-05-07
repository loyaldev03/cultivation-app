require "rails_helper"

RSpec.describe Cultivation::ActivateBatch, type: :command do
  let(:uom) { SeedUnitOfMeasure.call }
  let!(:facility) do
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

  let(:facility_strain) { create(:facility_strain, facility: facility) }

  let!(:catalogue) do
    create(:catalogue)
  end

  let!(:product) do
    create(:product,
           catalogue: catalogue,
           facility: facility,
           facility_strain: facility_strain)
  end

  let!(:package) do
    package = product.packages.new(
      product_name: product.name,
      quantity: 30,
      uom:  'kg',
      catalogue_id: catalogue.id,
      facility_id: facility.id,
      facility_strain_id: facility_strain.id,
    )
    package.save
  end

  let(:current_user) { create(:user, facilities: [facility.id]) }
  let!(:batch1) do
    Time.zone = facility.timezone
    start_date = Time.zone.local(2018, 2, 1, 8, 30, 0)
    create(:batch, :scheduled,
           facility_strain: facility_strain,
           facility: facility,
           start_date: start_date,
           quantity: 10,
           current_growth_stage: Constants::CONST_CLONE,
           batch_source: Constants::PURCHASED_CLONES_KEY)
  end
  let!(:task_staying_clone) do
    start_date = batch1.start_date
    duration = 5
    end_date = start_date + duration.days
    create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: batch1,
           phase: Constants::CONST_CLONE,
           start_date: start_date,
           duration: duration,
           end_date: end_date)
    create(:task, indelible: Constants::INDELIBLE_CLIP_POT_TAG, batch: batch1,
           phase: Constants::CONST_CLONE,
           start_date: start_date,
           duration: 1)
    create(:task, indelible: Constants::INDELIBLE_MOVING_TO_TRAY, batch: batch1,
           phase: Constants::CONST_CLONE,
           start_date: start_date,
           duration: 1)
    create(:task, indelible: Constants::INDELIBLE_STAYING, batch: batch1,
           phase: Constants::CONST_CLONE,
           start_date: start_date + 1.days,
           duration: 4,
           end_date: end_date)
  end
  let!(:task_staying_veg) do
    start_date = task_staying_clone.end_date
    duration = 7
    end_date = start_date + duration.days
    create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: batch1,
           phase: Constants::CONST_VEG,
           start_date: start_date,
           duration: duration,
           end_date: end_date)
    create(:task, indelible: Constants::INDELIBLE_STAYING, batch: batch1,
           phase: Constants::CONST_VEG,
           start_date: start_date,
           duration: duration,
           end_date: end_date)
  end
  let!(:task_staying_flower) do
    start_date = task_staying_veg.end_date
    duration = 10
    end_date = start_date + duration.days
    create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: batch1,
           phase: Constants::CONST_FLOWER,
           start_date: start_date,
           duration: duration,
           end_date: end_date)
    create(:task, indelible: Constants::INDELIBLE_STAYING, batch: batch1,
           phase: Constants::CONST_FLOWER,
           start_date: start_date,
           duration: duration,
           end_date: end_date)
  end
  let!(:task_staying_harvest) do
    start_date = task_staying_flower.end_date
    duration = 3
    end_date = start_date + duration.days
    create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: batch1,
           phase: Constants::CONST_HARVEST,
           start_date: start_date,
           duration: duration,
           end_date: end_date)
  end

  context ".call" do
    it "Activate batch on start date" do
      Time.use_zone(facility.timezone) do
        Timecop.freeze(batch1.start_date) do
          Cultivation::ActivateBatch.call(Time.current)

          result = Cultivation::Batch.find(batch1.id)
          expect(result.status).to eq 'ACTIVE'
          expect(result.current_growth_stage).to eq Constants::CONST_CLONE
        end
      end
    end

    it "Update batch growth stage to veg" do
      Time.use_zone(facility.timezone) do
        # pp "clo == #{task_staying_clone.start_date}"
        # pp "veg == #{task_staying_veg.start_date}"
        # pp "flo == #{task_staying_flower.start_date}"
        # pp "har == #{task_staying_harvest.start_date}"
        current_time = Time.zone.local(2018, 2, 7, 12, 0, 0)
        Timecop.freeze(current_time) do
          Cultivation::ActivateBatch.call(Time.current)

          result = Cultivation::Batch.find(batch1.id)
          expect(result.current_growth_stage).to eq Constants::CONST_VEG
        end
      end
    end

    it "Update batch growth stage to flower" do
      Time.use_zone(facility.timezone) do
        # pp "veg == #{task_staying_veg.start_date}"
        # pp "flo == #{task_staying_flower.start_date}"
        # pp "har == #{task_staying_harvest.start_date}"
        current_time = Time.zone.local(2018, 2, 13, 12, 0, 0)
        Timecop.freeze(current_time) do
          # pp "freeze@#{Time.current}"
          Cultivation::ActivateBatch.call(Time.current)

          result = Cultivation::Batch.find(batch1.id)
          expect(result.current_growth_stage).to eq Constants::CONST_FLOWER
        end
      end
    end

    it "Update batch growth stage to harvest" do
      Time.use_zone(facility.timezone) do
        # pp "flo == #{task_staying_flower.start_date}"
        # pp "har == #{task_staying_harvest.start_date}"
        current_time = Time.zone.local(2018, 2, 23, 12, 0, 0)
        Timecop.freeze(current_time) do
          # pp "freeze@#{Time.current}"
          Cultivation::ActivateBatch.call(Time.current)

          result = Cultivation::Batch.find(batch1.id)
          expect(result.current_growth_stage).to eq Constants::CONST_HARVEST
        end
      end
    end
  end
end

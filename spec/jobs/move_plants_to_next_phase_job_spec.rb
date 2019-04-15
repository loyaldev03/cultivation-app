require "rails_helper"

RSpec.describe MovePlantsToNextPhaseJob, type: :job do
  include ActiveJob::TestHelper

  let!(:facility) do
    facility = create(:facility, :is_complete)
    facility.rooms.each do |room, i|
      room.rows.each do |row|
        row.shelves.each do |shelf|
          shelf.trays.each(&:save!)
        end
      end
    end
    facility
  end

  let!(:current_user) do
    user = create(:user, facilities: [facility.id], default_facility_id: facility.id)
    user
  end
  let(:mother_room) do
    facility.rooms.detect do |r|
      r.purpose == Constants::CONST_MOTHER
    end
  end
  let(:clone_room) do
    facility.rooms.detect do |r|
      r.purpose == Constants::CONST_CLONE
    end
  end
  let(:first_row) { clone_room.rows.first }
  let(:clone_tray) do
    first_shelf = first_row.shelves.first
    first_shelf.trays.last
  end
  let(:clone_tray2) do
    first_shelf = first_row.shelves.first
    first_shelf.trays.first
  end
  let(:facility_strain) { build(:facility_strain) }
  let(:batch) do
    create(:batch, :active,
           current_growth_stage: Constants::CONST_CLONE,
           facility_id: facility.id,
           facility_strain: facility_strain,
           start_date: Time.strptime("2018/08/01", DATE_FORMAT),
           quantity: 5)
  end
  let(:mother_plant1) do
    create(:plant, :mother,
                    location_id: mother_room.id,
                    location_type: "room",
                    facility_strain: facility_strain,
                    modifier: current_user)
  end
  let(:mother_plant2) do
    create(:plant, :mother,
                    location_id: mother_room.id,
                    location_type: "room",
                    facility_strain: facility_strain,
                    modifier: current_user)
  end

  context ".perform" do
    after(:each) do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    let(:job_params) { batch.id.to_s }
    let(:job) { described_class.perform_later(job_params) }

    it "should queues the job" do
      expect { job }.to have_enqueued_job(described_class).
        with(job_params).
        on_queue("low")
    end

    it "should create plant if not exists" do
      # Prepare - Add a new clipping history record. New clipping history
      # should create a new plant in the system after running this job.
      Cultivation::PlantMovementHistory.create(
        batch_id: batch.id,
        phase: batch.current_growth_stage,
        activity: Constants::INDELIBLE_CLIP_POT_TAG,
        mother_plant_id: mother_plant1.id,
        mother_plant_code: mother_plant1.plant_id,
        user_id: current_user.id,
        user_name: current_user.display_name,
        destination_id: mother_room.id,
        destination_type: "room",
        destination_code: mother_room.code,
        plants: [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean],
      )
      Cultivation::PlantMovementHistory.create(
        batch_id: batch.id,
        phase: batch.current_growth_stage,
        activity: Constants::INDELIBLE_CLIP_POT_TAG,
        mother_plant_id: mother_plant2.id,
        mother_plant_code: mother_plant2.plant_id,
        user_id: current_user.id,
        user_name: current_user.display_name,
        destination_id: mother_room.id,
        destination_type: "room",
        destination_code: mother_room.code,
        plants: [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean],
      )

      # Execute
      perform_enqueued_jobs { job }

      # Validate
      total_clones = Inventory::Plant.where(
        cultivation_batch_id: batch.id,
        current_growth_stage: nil,
      ).size
      expect(total_clones).to eq 6
    end

    it "should move plants into trays" do
      plants_tags1 = [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean]
      plants_tags2 = [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean]
      Cultivation::PlantMovementHistory.create(
        batch_id: batch.id,
        phase: batch.current_growth_stage,
        activity: Constants::INDELIBLE_CLIP_POT_TAG,
        mother_plant_id: mother_plant1.id,
        mother_plant_code: mother_plant1.plant_id,
        user_id: current_user.id,
        user_name: current_user.display_name,
        destination_id: mother_room.id,
        destination_type: "room",
        destination_code: mother_room.code,
        plants: plants_tags1,
      )
      Cultivation::PlantMovementHistory.create(
        batch_id: batch.id,
        phase: batch.current_growth_stage,
        activity: Constants::INDELIBLE_CLIP_POT_TAG,
        mother_plant_id: mother_plant2.id,
        mother_plant_code: mother_plant2.plant_id,
        user_id: current_user.id,
        user_name: current_user.display_name,
        destination_id: mother_room.id,
        destination_type: "room",
        destination_code: mother_room.code,
        plants: plants_tags2,
      )
      Cultivation::PlantMovementHistory.create(
        batch_id: batch.id,
        phase: batch.current_growth_stage,
        activity: Constants::INDELIBLE_MOVING_TO_TRAY,
        user_id: current_user.id,
        user_name: current_user.display_name,
        destination_id: clone_tray.id,
        destination_type: "tray",
        destination_code: clone_tray.full_code,
        plants: plants_tags1,
      )
      Cultivation::PlantMovementHistory.create(
        batch_id: batch.id,
        phase: batch.current_growth_stage,
        activity: Constants::INDELIBLE_MOVING_TO_TRAY,
        user_id: current_user.id,
        user_name: current_user.display_name,
        destination_id: clone_tray2.id,
        destination_type: "tray",
        destination_code: clone_tray2.full_code,
        plants: plants_tags2,
      )

      # Execute
      perform_enqueued_jobs { job }

      # Validate
      total_clones = Inventory::Plant.
        where(
          cultivation_batch_id: batch.id,
          current_growth_stage: Constants::CONST_CLONE,
        ).size

      expect(total_clones).to eq 6
    end
  end
end
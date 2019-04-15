require "rails_helper"

RSpec.describe CalculateTotalActualCostBatchJob, type: :job do
  include ActiveJob::TestHelper

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

  let!(:valid_user) { User.create!(email: 'email@email.com', password: 'password', password_confirmation: 'password', hourly_rate: 5, overtime_hourly_rate: 7) }

  context ".perform" do
    after(:each) do
      clear_enqueued_jobs
      clear_performed_jobs
    end

    let(:job_params) { batch1.id.to_s }
    let(:job) { described_class.perform_later(job_params) }

    it "should queues the job" do
      expect { job }.to have_enqueued_job(described_class).
        with(job_params).
        on_queue("low")
    end

    it "should return correct sum value for actual_cost and actual_hours", focus: true do
      start_time = Time.zone.local(2019, 4, 21, 8,00)
      end_time = Time.zone.local(2019, 4, 21, 18, 00)
      task = Cultivation::Task.create(batch: batch1)
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)

      Cultivation::CalculateTaskActualCostAndHours.call_by_id(time_log.id.to_s, valid_user, true)
      CalculateTotalActualCostJob.perform_now(task.id.to_s)
      perform_enqueued_jobs { job }

      batch = Cultivation::Batch.find(batch1.id.to_s)

      expect(batch.actual_cost).to eq(50)
      expect(batch.actual_hours).to eq(10)
    end


    # it "should create plant if not exists" do
    #   # Prepare - Add a new clipping history record. New clipping history
    #   # should create a new plant in the system after running this job.
    #   Cultivation::PlantMovementHistory.create(
    #     batch_id: batch.id,
    #     phase: batch.current_growth_stage,
    #     activity: Constants::INDELIBLE_CLIP_POT_TAG,
    #     mother_plant_id: mother_plant1.id,
    #     mother_plant_code: mother_plant1.plant_id,
    #     user_id: current_user.id,
    #     user_name: current_user.display_name,
    #     destination_id: mother_room.id,
    #     destination_type: "room",
    #     destination_code: mother_room.code,
    #     plants: [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean],
    #   )
    #   Cultivation::PlantMovementHistory.create(
    #     batch_id: batch.id,
    #     phase: batch.current_growth_stage,
    #     activity: Constants::INDELIBLE_CLIP_POT_TAG,
    #     mother_plant_id: mother_plant2.id,
    #     mother_plant_code: mother_plant2.plant_id,
    #     user_id: current_user.id,
    #     user_name: current_user.display_name,
    #     destination_id: mother_room.id,
    #     destination_type: "room",
    #     destination_code: mother_room.code,
    #     plants: [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean],
    #   )

    #   # Execute
    #   perform_enqueued_jobs { job }

    #   # Validate
    #   total_clones = Inventory::Plant.where(
    #     cultivation_batch_id: batch.id,
    #     current_growth_stage: nil,
    #   ).size
    #   expect(total_clones).to eq 6
    # end

    # it "should move plants into trays" do
    #   plants_tags1 = [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean]
    #   plants_tags2 = [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean]
    #   # Create 2 movement history record to move 6 plants into a pot
    #   Cultivation::PlantMovementHistory.create(
    #     batch_id: batch.id,
    #     phase: batch.current_growth_stage,
    #     activity: Constants::INDELIBLE_CLIP_POT_TAG,
    #     mother_plant_id: mother_plant1.id,
    #     mother_plant_code: mother_plant1.plant_id,
    #     user_id: current_user.id,
    #     user_name: current_user.display_name,
    #     destination_id: mother_room.id,
    #     destination_type: "room",
    #     destination_code: mother_room.code,
    #     plants: plants_tags1,
    #   )
    #   Cultivation::PlantMovementHistory.create(
    #     batch_id: batch.id,
    #     phase: batch.current_growth_stage,
    #     activity: Constants::INDELIBLE_CLIP_POT_TAG,
    #     mother_plant_id: mother_plant2.id,
    #     mother_plant_code: mother_plant2.plant_id,
    #     user_id: current_user.id,
    #     user_name: current_user.display_name,
    #     destination_id: mother_room.id,
    #     destination_type: "room",
    #     destination_code: mother_room.code,
    #     plants: plants_tags2,
    #   )
    #   # Create 2 movement record to move 6 plants into tray in clone room
    #   Cultivation::PlantMovementHistory.create(
    #     batch_id: batch.id,
    #     phase: batch.current_growth_stage,
    #     activity: Constants::INDELIBLE_MOVING_TO_TRAY,
    #     user_id: current_user.id,
    #     user_name: current_user.display_name,
    #     destination_id: clone_tray.id,
    #     destination_type: "tray",
    #     destination_code: clone_tray.full_code,
    #     plants: plants_tags1,
    #   )
    #   Cultivation::PlantMovementHistory.create(
    #     batch_id: batch.id,
    #     phase: batch.current_growth_stage,
    #     activity: Constants::INDELIBLE_MOVING_TO_TRAY,
    #     user_id: current_user.id,
    #     user_name: current_user.display_name,
    #     destination_id: clone_tray2.id,
    #     destination_type: "tray",
    #     destination_code: clone_tray2.full_code,
    #     plants: plants_tags2,
    #   )

    #   # Execute
    #   perform_enqueued_jobs { job }

    #   # Validate
    #   total_clones = Inventory::Plant.
    #     where(
    #       cultivation_batch_id: batch.id,
    #       current_growth_stage: Constants::CONST_CLONE,
    #     ).size

    #   expect(total_clones).to eq 6
    # end

    # it "should move plants to next phase - veg1" do
    #   # Change batch to flower phase
    #   batch.current_growth_stage = Constants::CONST_VEG
    #   batch.save
    #   plants_tags1 = [Faker::Code.ean, Faker::Code.ean, Faker::Code.ean]

    #   # Add plants into inventory first before moving
    #   plants_tags1.each do |plant_tag|
    #     Inventory::Plant.create(
    #       cultivation_batch_id: batch.id,
    #       plant_id: plant_tag,
    #       plant_tag: plant_tag,
    #       planting_date: Time.current,
    #       current_growth_stage: Constants::CONST_CLONE,
    #       facility_strain_id: batch.facility_strain_id,
    #       created_by_id: current_user.id,
    #       modifier_id: current_user.id,
    #     )
    #   end

    #   # Move plants into trays in veg room
    #   Cultivation::PlantMovementHistory.create(
    #     batch_id: batch.id,
    #     phase: batch.current_growth_stage,
    #     activity: Constants::INDELIBLE_MOVING_NEXT_PHASE,
    #     user_id: current_user.id,
    #     user_name: current_user.display_name,
    #     destination_id: veg_tray1.id,
    #     destination_type: "tray",
    #     destination_code: veg_tray1.code,
    #     plants: plants_tags1,
    #   )

    #   # Execute to Move to Next Phase
    #   perform_enqueued_jobs { job }

    #   # Validate plants are moved into clone Room tray
    #   total_veg = Inventory::Plant.
    #     where(
    #       cultivation_batch_id: batch.id,
    #       current_growth_stage: Constants::CONST_VEG,
    #     ).size

    #   expect(total_veg).to eq(3)
    # end

    # it "should move plants to next phase - flower" do
    #   # Change batch to flower phase
    #   batch.current_growth_stage = Constants::CONST_FLOWER
    #   batch.save
    #   plants_tags1 = [Faker::Code.ean,Faker::Code.ean, Faker::Code.ean, Faker::Code.ean]

    #   # Add plants into inventory first before moving
    #   plants_tags1.each do |plant_tag|
    #     Inventory::Plant.create(
    #       cultivation_batch_id: batch.id,
    #       plant_id: plant_tag,
    #       plant_tag: plant_tag,
    #       planting_date: Time.current,
    #       current_growth_stage: Constants::CONST_VEG,
    #       facility_strain_id: batch.facility_strain_id,
    #       created_by_id: current_user.id,
    #       modifier_id: current_user.id,
    #     )
    #   end

    #   # Move plants into trays in veg room
    #   Cultivation::PlantMovementHistory.create(
    #     batch_id: batch.id,
    #     phase: batch.current_growth_stage,
    #     activity: Constants::INDELIBLE_MOVING_NEXT_PHASE,
    #     user_id: current_user.id,
    #     user_name: current_user.display_name,
    #     destination_id: flower_tray1.id,
    #     destination_type: "tray",
    #     destination_code: flower_tray1.code,
    #     plants: plants_tags1,
    #   )

    #   # Execute to Move to Next Phase
    #   perform_enqueued_jobs { job }

    #   # Validate plants are moved into clone Room tray
    #   total_veg = Inventory::Plant.
    #     where(
    #       cultivation_batch_id: batch.id,
    #       current_growth_stage: Constants::CONST_FLOWER,
    #     ).size

    #   expect(total_veg).to eq(4)
    # end
  end
end

require 'rails_helper'
require 'sidekiq/testing'

RSpec.describe DailySystemNotificationWorker, type: :job do
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
  let!(:facility_strain) { create(:facility_strain, facility: facility) }
  let!(:manager) { create(:user, :manager, facilities: [facility.id]) }

  context 'perform_async' do
    it 'should enqueue worker' do
      expect {
        described_class.perform_async
      }.to change(described_class.jobs, :size).by(1)
    end
  end

  context 'batch starts in within 5 days time' do
    let!(:scheduled_batch) do
      Time.zone = facility.timezone
      start_date = Time.zone.local(2018, 6, 1, 8, 30, 0)
      create(:batch, :scheduled,
             facility_strain: facility_strain,
             facility: facility,
             start_date: start_date,
             quantity: 10,
             current_growth_stage: Constants::CONST_CLONE,
             batch_source: Constants::PURCHASED_CLONES_KEY)
    end
    let!(:task_staying_clone) do
      start_date = scheduled_batch.start_date
      duration = 5
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: scheduled_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_CLIP_POT_TAG, batch: scheduled_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: 1)
      create(:task, indelible: Constants::INDELIBLE_MOVING_TO_TRAY, batch: scheduled_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: 1)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: scheduled_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date + 1.days,
                    duration: 4,
                    end_date: end_date)
    end
    let!(:task_staying_veg) do
      start_date = task_staying_clone.end_date
      duration = 7
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: scheduled_batch,
                    phase: Constants::CONST_VEG,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: scheduled_batch,
                    phase: Constants::CONST_VEG,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let!(:task_staying_flower) do
      start_date = task_staying_veg.end_date
      duration = 10
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: scheduled_batch,
                    phase: Constants::CONST_FLOWER,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: scheduled_batch,
                    phase: Constants::CONST_FLOWER,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let!(:task_staying_harvest) do
      start_date = task_staying_flower.end_date
      duration = 3
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: scheduled_batch,
                    phase: Constants::CONST_HARVEST,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end

    let(:job) { described_class.new }

    it 'notify 5 days before batch start date' do
      Time.use_zone(facility.timezone) do
        current_time = scheduled_batch.start_date - 5.days
        Timecop.freeze(current_time) do
          job.perform

          res = Notification.where(action: 'batch_start_reminder').first
          expect(res.notifiable_name).to end_with('is scheduled to start in 5 days')
        end
      end
    end

    it 'notify 4 days before batch start date' do
      Time.use_zone(facility.timezone) do
        current_time = scheduled_batch.start_date - 4.days
        Timecop.freeze(current_time) do
          job.perform

          res = Notification.where(action: 'batch_start_reminder').first
          expect(res.notifiable_name).to end_with('is scheduled to start in 4 days')
        end
      end
    end

    it 'notify a days before batch start date' do
      Time.use_zone(facility.timezone) do
        current_time = scheduled_batch.start_date - 1.days
        Timecop.freeze(current_time) do
          job.perform

          res = Notification.where(action: 'batch_start_reminder').first
          expect(res.notifiable_name).to end_with('is scheduled to start in 1 days')
        end
      end
    end

    it 'no notify on same day as batch start date' do
      Time.use_zone(facility.timezone) do
        current_time = scheduled_batch.start_date
        Timecop.freeze(current_time) do
          job.perform

          result = Notification.last
          expect(Notification.count).to eq 0
        end
      end
    end

    context 'schedule batch with unassigned tasks' do
      it 'notify manager on unassigned tasks' do
        Time.use_zone(facility.timezone) do
          current_time = scheduled_batch.start_date - 1.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_unassigned_tasks_reminder').count
            expect(res).to eq 1
          end
        end
      end
    end
  end

  context 'batch about to move into next phase' do
    let!(:active_batch) do
      Time.zone = facility.timezone
      start_date = Time.zone.local(2018, 6, 1, 8, 30, 0)
      create(:batch, :active,
             facility_strain: facility_strain,
             facility: facility,
             start_date: start_date,
             quantity: 10,
             current_growth_stage: Constants::CONST_CLONE,
             batch_source: Constants::PURCHASED_CLONES_KEY)
    end
    let!(:task_staying_clone) do
      start_date = active_batch.start_date
      duration = 5
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_CLIP_POT_TAG, batch: active_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: 1)
      create(:task, indelible: Constants::INDELIBLE_MOVING_TO_TRAY, batch: active_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: 1)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: active_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date + 1.days,
                    duration: 4,
                    end_date: end_date)
    end
    let!(:task_staying_veg) do
      start_date = task_staying_clone.end_date
      duration = 7
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_VEG,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: active_batch,
                    phase: Constants::CONST_VEG,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let!(:task_staying_flower) do
      start_date = task_staying_veg.end_date
      duration = 10
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_FLOWER,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: active_batch,
                    phase: Constants::CONST_FLOWER,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let!(:task_staying_harvest) do
      start_date = task_staying_flower.end_date
      duration = 3
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_HARVEST,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end

    let(:job) { described_class.new }

    it 'notify 2 days before moving into veg' do
      Time.use_zone(facility.timezone) do
        current_time = task_staying_veg.start_date - 2.days
        Timecop.freeze(current_time) do
          job.perform

          res = Notification.where(action: 'batch_move_reminder').count
          expect(res).to eq 0
        end
      end
    end

    it 'notify a day before moving into veg' do
      Time.use_zone(facility.timezone) do
        current_time = task_staying_veg.start_date - 1.days
        Timecop.freeze(current_time) do
          job.perform

          res = Notification.where(action: 'batch_move_reminder').first
          expect(res.notifiable_name).to end_with("is scheduled to move into 'veg' phase tomorrow")
        end
      end
    end

    it 'notify a day before moving into flower' do
      Time.use_zone(facility.timezone) do
        current_time = task_staying_flower.start_date - 1.days
        Timecop.freeze(current_time) do
          job.perform

          res = Notification.where(action: 'batch_move_reminder').first
          expect(res.notifiable_name).to end_with("is scheduled to move into 'flower' phase tomorrow")
        end
      end
    end

    it 'no notification on same day as veg' do
      Time.use_zone(facility.timezone) do
        current_time = task_staying_veg.start_date
        Timecop.freeze(current_time) do
          job.perform

          res = Notification.where(action: 'batch_move_reminder').count
          expect(res).to eq 0
        end
      end
    end
  end

  context 'batch is moving into next stage' do
    let!(:active_batch) do
      Time.zone = facility.timezone
      start_date = Time.zone.local(2018, 8, 1, 8, 30, 0)
      create(:batch, :active,
             facility_strain: facility_strain,
             facility: facility,
             start_date: start_date,
             quantity: 10,
             current_growth_stage: Constants::CONST_CLONE,
             batch_source: Constants::PURCHASED_CLONES_KEY)
    end
    let!(:task_staying_clone) do
      start_date = active_batch.start_date
      duration = 5
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_CLIP_POT_TAG, batch: active_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: 1)
      create(:task, indelible: Constants::INDELIBLE_MOVING_TO_TRAY, batch: active_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date,
                    duration: 1)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: active_batch,
                    phase: Constants::CONST_CLONE,
                    start_date: start_date + 1.days,
                    duration: 4,
                    end_date: end_date)
    end
    let!(:task_staying_veg) do
      start_date = task_staying_clone.end_date
      duration = 7
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_VEG,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: active_batch,
                    phase: Constants::CONST_VEG,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let!(:task_staying_flower) do
      start_date = task_staying_veg.end_date
      duration = 10
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_FLOWER,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
      create(:task, indelible: Constants::INDELIBLE_STAYING, batch: active_batch,
                    phase: Constants::CONST_FLOWER,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let!(:task_staying_harvest) do
      start_date = task_staying_flower.end_date
      duration = 5
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_HARVEST,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let!(:task_staying_cure) do
      start_date = task_staying_harvest.end_date
      duration = 15
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_CURE,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let!(:task_staying_packaging) do
      start_date = task_staying_cure.end_date
      duration = 3
      end_date = start_date + duration.days
      create(:task, indelible: Constants::INDELIBLE_GROUP, indent: 0, batch: active_batch,
                    phase: Constants::CONST_PACKAGING,
                    start_date: start_date,
                    duration: duration,
                    end_date: end_date)
    end
    let(:job) { described_class.new }

    context 'notify before harvest' do
      it 'notify 3 days before harvest' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_harvest.start_date - 3.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_harvest_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'notify 2 days before harvest' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_harvest.start_date - 2.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_harvest_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'notify 1 days before harvest' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_harvest.start_date - 1.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_harvest_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'not notify on same date as harvest' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_harvest.start_date
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_harvest_reminder').count
            expect(res).to eq 0
          end
        end
      end
    end
    context 'notify before cure' do
      it 'notify 3 days before cure' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_cure.start_date - 3.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_cure_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'notify 2 days before cure' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_cure.start_date - 2.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_cure_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'notify 1 days before cure' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_cure.start_date - 1.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_cure_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'not notify on same date as cure' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_cure.start_date
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_cure_reminder').count
            expect(res).to eq 0
          end
        end
      end
    end
    context 'notify before packaging' do
      it 'notify 3 days before packaging' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_packaging.start_date - 3.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_packaging_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'notify 2 days before packaging' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_packaging.start_date - 2.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_packaging_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'notify 1 days before packaging' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_packaging.start_date - 1.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_packaging_reminder').count
            expect(res).to eq 1
          end
        end
      end

      it 'not notify on same date as packaging' do
        Time.use_zone(facility.timezone) do
          current_time = task_staying_packaging.start_date
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_packaging_reminder').count
            expect(res).to eq 0
          end
        end
      end
    end

    context 'active batch with unassigned_tasks' do
      it 'notify manager of unassigned_tasks' do
        Time.use_zone(facility.timezone) do
          current_time = active_batch.start_date - 1.days
          Timecop.freeze(current_time) do
            job.perform

            res = Notification.where(action: 'batch_unassigned_tasks_reminder').count
            expect(res).to eq 1
          end
        end
      end
    end
  end
end

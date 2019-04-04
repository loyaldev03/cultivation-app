require 'rails_helper'

RSpec.describe Cultivation::CalculateTaskActualCostAndHours, type: :command do
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
  
  # CASES
  # 7.30am - 8.30 am => exceed start working hour
  # 9am - 5pm => in the range
  # 5.30pm -6.30pm => exceed end working hour
  # 7.30am - 6.30pm => exceed start and end working hour

  context ".call" do
    it "In working hour range time_logs" do # Between 8am to 6pm
        start_time = Time.zone.local(2019, 4, 21, 8,00)
        end_time = Time.zone.local(2019, 4, 21, 18, 00)
        task = Cultivation::Task.create(batch: batch1)
        time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
        cmd = Cultivation::CalculateTaskActualCostAndHours.call(time_log.id.to_s)
        time_log = Cultivation::TimeLog.find(time_log.id.to_s)

        expect(cmd.errors).to eq({})
        expect(cmd.result[:actual_minutes]).to eq(600)
        expect(cmd.result[:actual_cost]).to eq(50)
        expect(time_log.breakdowns.count).to eq(1)
    end

    it "Exceed start working hours return corrent actual cost" do
      start_time = Time.zone.local(2019, 4, 21, 7,30) #ot 7.30-8.00 => 30 minutes * (7/60) = 3.5
      end_time = Time.zone.local(2019, 4, 21, 18, 00) # 8.00 - 18.00 => 10 hours * 5 = 50.00
      task = Cultivation::Task.create(batch: batch1)
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateTaskActualCostAndHours.call(time_log.id.to_s)
      time_log = Cultivation::TimeLog.find(time_log.id.to_s)

      expect(cmd.errors).to eq({})
      expect(cmd.result[:actual_minutes]).to eq(630)
      expect(cmd.result[:actual_cost]).to eq(53.5)
      expect(time_log.breakdowns.count).to eq(2)
    end


    it "Exceed end working hours return corrent actual cost" do
      start_time = Time.zone.local(2019, 4, 21, 8,00) #ot 18.00-19.30 => 30 minutes * (7/60) = 10.5
      end_time = Time.zone.local(2019, 4, 21, 19, 30) # 8.00 - 18.00 => 10 hours * 5 = 50.00
      task = Cultivation::Task.create(batch: batch1)
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateTaskActualCostAndHours.call(time_log.id.to_s)
      time_log = Cultivation::TimeLog.find(time_log.id.to_s)

      expect(cmd.errors).to eq({})
      expect(cmd.result[:actual_minutes]).to eq(690)
      expect(cmd.result[:actual_cost]).to eq(60.5)
      expect(time_log.breakdowns.count).to eq(2)
    end

    it "Exceed start and end working hours return corrent actual cost" do
      start_time = Time.zone.local(2019, 4, 21, 7,00) #ot 18.00-19.30 => 2 hour 30 minutes * (7/60) = 17.5
      end_time = Time.zone.local(2019, 4, 21, 19, 30) # 8.00 - 18.00 => 10 hours * 5 = 50.00 = 67.5
      task = Cultivation::Task.create(batch: batch1)
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateTaskActualCostAndHours.call(time_log.id.to_s)
      time_log = Cultivation::TimeLog.find(time_log.id.to_s)

      expect(cmd.errors).to eq({})
      expect(cmd.result[:actual_minutes]).to eq(750)
      expect(cmd.result[:actual_cost]).to eq(67.5)
      expect(time_log.breakdowns.count).to eq(3)
    end

    it "OT full before working hours start time " do
      start_time = Time.zone.local(2019, 4, 21, 6,00) #ot 18.00-19.30 => 2 hour 30 minutes * (7/60) = 17.5
      end_time = Time.zone.local(2019, 4, 21, 7, 30) # 8.00 - 18.00 => 10 hours * 5 = 50.00 = 67.5
      task = Cultivation::Task.create(batch: batch1)
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateTaskActualCostAndHours.call(time_log.id.to_s)
      time_log = Cultivation::TimeLog.find(time_log.id.to_s)

      expect(cmd.result[:actual_minutes]).to eq(90)
      expect(cmd.result[:actual_cost]).to eq(10.5)
      expect(time_log.breakdowns.count).to eq(1)
    end

    it "OT full after working hours end time " do
      start_time = Time.zone.local(2019, 4, 21, 19, 00) #ot 18.00-19.30 => 2 hour 30 minutes * (7/60) = 17.5
      end_time = Time.zone.local(2019, 4, 21, 21, 30) # 8.00 - 18.00 => 10 hours * 5 = 50.00 = 67.5
      task = Cultivation::Task.create(batch: batch1)
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateTaskActualCostAndHours.call(time_log.id.to_s)
      time_log = Cultivation::TimeLog.find(time_log.id.to_s)

      expect(cmd.result[:actual_minutes]).to eq(150)
      expect(cmd.result[:actual_cost]).to eq(17.5)
      expect(time_log.breakdowns.count).to eq(1)
    end

  end
end

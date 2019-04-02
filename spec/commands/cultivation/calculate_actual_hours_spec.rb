require 'rails_helper'

RSpec.describe Cultivation::CalculateActualHours, type: :command do
  let!(:valid_user) { User.create!(email: 'email@email.com', password: 'password', password_confirmation: 'password', hourly_rate: 5, overtime_hourly_rate: 7) }
  # let(:facility) { Facility.create!(name: Faker::Lorem.word, code: Faker::Lorem.word) }
  # let!(:user) { create(:users) }
  

  # CASES
  # 7.30am - 8.30 am => exceed start working hour
  # 9am - 5pm => in the range
  # 5.30pm -6.30pm => exceed end working hour
  # 7.30am - 6.30pm => exceed start and end working hour

  context ".call" do
    it "In range time logs return correct actual cost"  do
      start_time = DateTime.new(2019, 4, 21, 8,00) # 17:30 - 9:30 = 8.30 hours * 5 = 42.5
      end_time = DateTime.new(2019, 4, 21, 18, 00)
      task = Cultivation::Task.create
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateActualHours.call(time_log.id.to_s)
      expect(cmd.errors).to eq({})
      expect(cmd.result).to eq(50.0)
    end

    it "Exceed start working hours return corrent actual cost" do
      start_time = DateTime.new(2019, 4, 21, 7,30) #ot 7.30-8.00 => 30 minutes * (7/60) = 3.5
      end_time = DateTime.new(2019, 4, 21, 18, 00) # 8.00 - 18.00 => 10 hours * 5 = 50.00
      task = Cultivation::Task.create
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateActualHours.call(time_log.id.to_s)
      expect(cmd.errors).to eq({})
      expect(cmd.result).to eq(53.5)
    end


    it "Exceed end working hours return corrent actual cost" do
      start_time = DateTime.new(2019, 4, 21, 8,00) #ot 18.00-19.30 => 30 minutes * (7/60) = 10.5
      end_time = DateTime.new(2019, 4, 21, 19, 30) # 8.00 - 18.00 => 10 hours * 5 = 50.00
      task = Cultivation::Task.create
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateActualHours.call(time_log.id.to_s)
      expect(cmd.errors).to eq({})
      expect(cmd.result).to eq(60.5)
    end

    it "Exceed end working hours return corrent actual cost" do
      start_time = DateTime.new(2019, 4, 21, 7,00) #ot 18.00-19.30 => 2 hour 30 minutes * (7/60) = 17.5
      end_time = DateTime.new(2019, 4, 21, 19, 30) # 8.00 - 18.00 => 10 hours * 5 = 50.00 = 67.5
      task = Cultivation::Task.create
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateActualHours.call(time_log.id.to_s)
      expect(cmd.errors).to eq({})
      expect(cmd.result).to eq(67.5)
    end

    it "OT full before working hours start time " do
      start_time = DateTime.new(2019, 4, 21, 6,00) #ot 18.00-19.30 => 2 hour 30 minutes * (7/60) = 17.5
      end_time = DateTime.new(2019, 4, 21, 7, 30) # 8.00 - 18.00 => 10 hours * 5 = 50.00 = 67.5
      task = Cultivation::Task.create
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateActualHours.call(time_log.id.to_s)
      expect(cmd.result).to eq(10.5)
    end

    it "OT full after working hours end time " do
      start_time = DateTime.new(2019, 4, 21, 19, 00) #ot 18.00-19.30 => 2 hour 30 minutes * (7/60) = 17.5
      end_time = DateTime.new(2019, 4, 21, 21, 30) # 8.00 - 18.00 => 10 hours * 5 = 50.00 = 67.5
      task = Cultivation::Task.create
      time_log = Cultivation::TimeLog.create(start_time: start_time, end_time: end_time, user: valid_user, task: task)
      cmd = Cultivation::CalculateActualHours.call(time_log.id.to_s)
      expect(cmd.result).to eq(17.5)
    end

  end
end

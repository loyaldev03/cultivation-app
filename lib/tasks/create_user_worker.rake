desc "Create user worker"

task create_user_worker: :environment do

  facility = Facility.find_by(name: 'DEMO F15')
  facility = Facility.first
  common_role_worker = Common::Role.find_by(name: 'Gardener')
  (0..20).each do |a|
    user = User.new
    user.first_name = Faker::Name.first_name
    user.last_name = Faker::Name.last_name
    user.email = Faker::Internet.email
    user.phone_number = '14152602822'
    user.timezone = 'Pacific Time (US & Canada)'
    user.default_facility_id = facility.id.to_s
    user.facilities = [facility.id]
    user.roles = [common_role_worker.id]
    user.is_active = true 
    user.hourly_rate = 15
    user.overtime_hourly_rate = 25
    user.password = 'abcd1234'
    user.login_code_expired_at = Time.now + 10.years
    user.login_code = '1234'
    user.user_mode = 'worker'
    user.exempt = false
    user.save
  end

  puts "created 20 worker"

  puts "creating work schedule"

  facility = Facility.first#find_by(name: 'DEMO F15')

  users = User.where(default_facility_id: facility.id)

  ((Date.today.beginning_of_year)..Date.today+ 1.year).each do |a|
    random_boolean = [true, false].sample
    random_hours = [8, 9, 10, 11, 12, 13, 15, 17].sample
    random_add_hours = [1, 2, 3, 4, 5, 6, 7].sample
    random_num_worker = [1, 2, 3, 4, 5, 6, 7].sample
    added_hours = random_hours + random_add_hours
    users_assigned = users.sample(random_num_worker)
    users_assigned.each do |user|
      if random_boolean
        work_schedule = user.work_schedules.build
        work_schedule.date = a
        work_schedule.start_time = Time.new(2019, 1, 1, random_hours, 00)
        work_schedule.end_time = Time.new(2019, 1, 1, added_hours, 00)
        work_schedule.save
      end
      user.save
      puts 'user work schedule created'
    end
  end

end
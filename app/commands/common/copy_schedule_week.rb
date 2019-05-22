module Common
  class CopyScheduleWeek
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      if valid?
        save_record
      else
        nil
      end
    end

    private

    def save_record
      work_schedules = @user.work_schedules.select { |a| a[:date] }

      from = Time.zone.parse(@args[:from], Time.current)
      to = Time.zone.parse(@args[:to], Time.current)

      (0..6).each do |i|
        from_date = from + i.days
        from_schedule = work_schedules.detect { |a| a[:date].beginning_of_day == from_date.beginning_of_day }

        to_date = to + i.days
        to_schedule = work_schedules.detect { |a| a[:date].beginning_of_day == to_date.beginning_of_day }

        if from_schedule.present?
          if to_schedule.present?
            to_schedule.update(
              start_time: from_schedule.start_time,
              end_time: from_schedule.end_time,
            )
          else
            @user.work_schedules.build(
              date: to_date,
              start_time: from_schedule.start_time,
              end_time: from_schedule.end_time,
            )
          end
        else
          @user.work_schedules = @user.work_schedules.select { |a| a[:date] }.reject { |a| a[:date].beginning_of_day == to_date.beginning_of_day }
        end
      end
      @user.save!
    end

    def valid?
      errors.add(:name, 'Date from week and to week should exist') if @args[:to].blank? or @args[:from].blank?
      errors.empty?
    end
  end
end

module People
  class Reminder
    prepend SimpleCommand

    WorkRequest = Struct.new(:id, :status)

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      f_ids = @args[:facility_id].split(',').map { |x| x.to_bson_id }
      tor = time_off_request(f_ids).count
      el = employees_leaving(f_ids).count
      es = employees_starting(f_ids).count

      {
        time_off_request: tor,
        employees_leaving: el,
        employees_starting: es,
      }
    end

    private

    def time_off_request(f_ids)
      @grouping_users = User.where(is_active: true).in(facilities: f_ids).compact
      @work_requests = []
      @grouping_users.each do |v|
        @work_requests.push(Common::WorkRequest.where(user_id: v.id, status: 'pending'))
      end
      return @work_requests
    end

    def employees_starting(f_ids)
      @grouping_users = User.where(:expected_start_date => (Time.now.beginning_of_week..Time.now.end_of_week)).where(is_active: false)

      result = @grouping_users.in(facilities: f_ids).compact

      return result
    end

    def employees_leaving(f_ids)
      @grouping_users = User.where(is_active: true).ne(expected_leave_date: nil)

      result = @grouping_users.in(facilities: f_ids).compact

      return result
    end
  end
end

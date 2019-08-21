module People
  class Reminder
    prepend SimpleCommand

    WorkRequest = Struct.new(:id, :status)

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      tor = time_off_request.count
      el = employees_leaving.count
      es = employees_starting.count

      {
        time_off_request: tor,
        employees_leaving: el,
        employees_starting: es,
      }
    end

    private

    def time_off_request
      @grouping_users = User.where(is_active: true).map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      @work_requests = []
      @grouping_users.each do |v|
        @work_requests.push(Common::WorkRequest.where(user_id: v.id, status: 'pending'))
      end
      return @work_requests
    end

    def employees_starting
      @grouping_users = User.where(:expected_start_date => (Time.now.beginning_of_week..Time.now.end_of_week)).where(is_active: false)

      result = @grouping_users.map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact

      return result
    end

    def employees_leaving
      @grouping_users = User.where(is_active: true).ne(expected_leave_date: nil)

      result = @grouping_users.map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact

      return result
    end
  end
end

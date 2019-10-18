module People
  class QueryWorkerAttrition
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      result = months.map do |m|
        {
          month: m,
          new_employee_count: new_employee.map { |x| x[:value] if x[:month] == m }.compact.sum,
          leaving_employee_count: leaving_employee.map { |x| x[:value] if x[:month] == m }.compact.sum,
        }
      end
    end

    private

    def new_employee
      f_ids = @args[:facility_id].split(',').map { |x| x.to_bson_id }
      date = Time.parse("#{@args[:period]}-01-01")
      if !@args[:role].present?
        users = User.in(facilities: f_ids).where(c_at: (date.beginning_of_year..date.end_of_year), is_active: true).compact
      else
        users = User.in(facilities: f_ids).where(c_at: (date.beginning_of_year..date.end_of_year), is_active: true).map { |x| x if x.roles.include?(@args[:role].to_bson_id) }.compact
      end

      persons = users.map do |u|
        {_id: u.id,
         month: "#{u&.c_at ? u&.c_at.strftime('%B') : nil}",
         year: "#{u&.c_at ? u&.c_at.year : nil}",
         is_active: u.is_active}
      end
      workers = persons.group_by { |x| x[:month] }

      result = workers.map do |x|
        {
          month: x[0],
          value: x[1].count,
        }
      end
      return result
    end

    def leaving_employee
      f_ids = @args[:facility_id].split(',').map { |x| x.to_bson_id }
      date = Time.parse("#{@args[:period]}-01-01")
      if !@args[:role].present?
        users = User.in(facilities: f_ids).where(c_at: (date.beginning_of_year..date.end_of_year)).compact
      else
        users = User.in(facilities: f_ids).where(c_at: (date.beginning_of_year..date.end_of_year)).map { |x| x if x.roles.include?(@args[:role].to_bson_id) }.compact
      end
      user_json = []
      users.each do |u|
        if u&.expected_leave_date.present?
          user_json << {
            _id: u.id,
            month: "#{u&.expected_leave_date ? u&.expected_leave_date.strftime('%B') : nil}",
            year: "#{u&.expected_leave_date ? u&.expected_leave_date.year : nil}",
            is_active: u.is_active,
          }
        end
      end

      workers = user_json.group_by { |x| x[:month] }

      result = workers.map do |x|
        {
          month: x[0],
          value: x[1].count,
        }
      end
      return result
    end
  end
end

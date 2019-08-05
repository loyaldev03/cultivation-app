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
          new_employee_count: new_employee.map { |x| x[:value] if x[:month] == m }.sum,
          leaving_employee_count: leaving_employee.map { |x| x[:value] if x[:month] == m }.sum,
        }
      end
    end

    private

    def new_employee
      if !@args[:role].present?
        Rails.logger.debug('ATSSS')
        users = User.all.map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      else
        Rails.logger.debug('BAWAHHH')
        users = User.all.map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) && x.roles.include?(@args[:role].to_bson_id) }.compact
      end

      persons = users.map do |u|
        {_id: u.id,
         month: "#{u&.c_at ? u&.c_at.strftime('%B') : nil}",
         year: "#{u&.c_at ? u&.c_at.year : nil}",
         is_active: u.is_active}
      end
      a = persons.map { |x| x if x[:year] == @args[:period] }.compact
      workers = a.group_by { |x| x[:month] }

      result = workers.map do |x|
        {
          month: x[0],
          value: x[1].count,
        }
      end
      return result
    end

    def leaving_employee
      if !@args[:role].present?
        users = User.all.map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      else
        users = User.all.map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) && x.roles.include?(@args[:role].to_bson_id) }.compact
      end
      persons = users.map do |u|
        {_id: u.id,
         month: "#{u&.expected_leave_date ? u&.expected_leave_date.strftime('%B') : nil}",
         year: "#{u&.expected_leave_date ? u&.expected_leave_date.year : nil}",
         is_active: u.is_active}
      end
      a = persons.map { |x| x if x[:year] == @args[:period] }.compact
      workers = a.group_by { |x| x[:month] }

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

module People
  class QueryWorkerAttrition
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      result = new_employee
    end

    private

    def new_employee
      if @args[:role] == 'All' || !@args[:role].present?
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
      if @args[:role] == 'All' || !@args[:role].present?
        Rails.logger.debug('ATSSS')
        users = User.all.map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      else
        Rails.logger.debug('BAWAHHH')
        users = User.all.map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) && x.roles.include?(@args[:role].to_bson_id) }.compact
      end
      persons = users.map do |u|
        {_id: u.id,
         month: "#{u&.user_expected_leave_date ? u&.user_expected_leave_date.strftime('%B') : nil}",
         year: "#{u&.user_expected_leave_date ? u&.user_expected_leave_date.year : nil}",
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

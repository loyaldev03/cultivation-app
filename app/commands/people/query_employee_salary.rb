module People
  class QueryEmployeeSalary
    prepend SimpleCommand

    WorkerInfo = Struct.new(:id, :name, :title)

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      date = Date.parse("#{@args[:period]}-01-01")
      users = User.where(c_at: (date.beginning_of_year..date.end_of_year)).where(is_active: true).map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      bar_colors = ['red', 'blue', 'orange', 'purple', 'yellowgreen', 'mediumvioletred', 'cadetblue', 'dodgerblue', 'sienna', 'palevioletred', 'cornflowerblue']
      json = []

      Common::Role.all.map do |role|
        bar_colors.shuffle
        color_pick = bar_colors.sample
        bar_colors.delete(color_pick)
        sum_of_labor_costs = 0
        users.each do |user|
          if user.roles.include?(role.id)
            sum_of_labor_costs += user.cultivation_tasks.where(facility_id: @args[:facility_id]).map { |x| x.actual_labor_cost }.sum
          end
        end
        bar_colors = ['red', 'blue', 'orange', 'purple', 'yellowgreen', 'mediumvioletred', 'cadetblue', 'dodgerblue', 'sienna', 'palevioletred', 'cornflowerblue']
        bar_colors.shuffle
        color_pick = bar_colors.sample
        bar_colors.delete(color_pick)
        if sum_of_labor_costs != 0
          json << {
            title: role.name,
            color: color_pick,
            actual_labor_costs: sum_of_labor_costs,
          }
        end
      end
      json
    end
  end
end

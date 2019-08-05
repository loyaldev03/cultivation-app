module People
  class QueryEmployeeSalary
    prepend SimpleCommand

    WorkerInfo = Struct.new(:id, :name, :title)

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      bar_colors = ['red', 'blue', 'orange', 'purple', 'yellowgreen', 'mediumvioletred', 'cadetblue', 'dodgerblue', 'sienna', 'palevioletred', 'cornflowerblue']

      result = User.all.group_by(&:title).map do |d|
        user = []
        user = d[1].map do |e|
          {
            user_id: e[:_id],
            tasks: user_cult_tasks(e[:_id]),
            labor_cost_sum: labor_cost_sum(e[:_id]),

          }
        end
        bar_colors.shuffle
        color_pick = bar_colors.sample
        bar_colors.delete(color_pick)

        {
          group_title: d[0],
          value: user.map { |x| x[:labor_cost_sum] }.sum,
          color: color_pick,

        }
      end

      result
    end

    private

    def user_cult_tasks(user_id)
      tasks = User.find(user_id).cultivation_tasks.map { |x| x if x[:facility_id] == @args[:facility_id].to_bson_id }.compact
    end

    def labor_cost_sum(user_id)
      sum = User.find(user_id).cultivation_tasks.map { |x| x[:actual_labor_cost] if x[:facility_id] == @args[:facility_id].to_bson_id }.compact.sum
    end
  end
end

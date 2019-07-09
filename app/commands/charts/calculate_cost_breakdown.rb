module Charts
  class CalculateCostBreakdown
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      month = Date.parse("#{@args[:month]} #{@args[:year]}")
      tasks = Cultivation::Task.where(:start_date.lte => month.beginning_of_month, :end_date.gte => month.end_of_month)
      material_cost = 0
      labour_cost = 0
      tasks.each do |task|
        labour_cost += task.actual_labor_cost
        material_cost += task.actual_material_cost
      end
      [
        {
          cost_type: 'material',
          value: material_cost,
        },
        {
          cost_type: 'labour',
          value: labour_cost,
        },
        {
          cost_type: 'water',
          value: 200,
        },
        {
          cost_type: 'electricity',
          value: 1200,
        },
      ]
    end
  end
end

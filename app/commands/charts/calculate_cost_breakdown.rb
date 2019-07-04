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
      {
        material_cost: material_cost,
        labour_cost: labour_cost,
        water_cost: 200,
        electricity: 1200,
      }
    end
  end
end

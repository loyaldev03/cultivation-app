module Charts
  class HighestCostTask
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      tasks_result = check_range(@args[:range])

      tasks = tasks_result.map do |t|
        {name: t.name,
         actual_cost: t.actual_cost.round(2),
         sum_actual_hours: t.sum_actual_hours.round(2),
         start_at: t.start_date.to_date,
         end_at: t.end_date.to_date}
      end
      top_five_tasks = tasks.sort_by { |h| [-h[:actual_cost], -h[:sum_actual_hours]] }.first(5)
      [{
        range: @args[:range],
        total_actual_cost: top_five_tasks.map { |h| h[:actual_cost] }.sum.round(2),
        total_sum_actual_hours: top_five_tasks.map { |h| h[:sum_actual_hours] }.sum.round(2),
        tasks: top_five_tasks,
      }]
    end

    def check_range(range)
      if range == 'this_month'
        start_date = Time.current.beginning_of_month
        end_date = Time.current.end_of_month
      elsif range == 'this_year'
        start_date = Time.current.beginning_of_year
        end_date = Time.current.end_of_year
      elsif range == 'this_week'
        start_date = Time.current.beginning_of_week
        end_date = Time.current.end_of_week
      else
        start_date = 'all'
      end

      tasks = Cultivation::Task.in(id: low_levelquery_tasks).includes(:time_logs)
      if start_date == 'all'
        tasks
      else
        range_by_date(start_date, end_date, tasks)
      end
    end

    def range_by_date(start_date, end_date, tasks)
      cond_a = tasks.and({end_date: {"$gte": start_date}}, start_date: {"$lte": end_date}).selector
      cond_b = tasks.and({start_date: {"$gte": start_date}}, start_date: {"$lte": end_date}).selector
      cond_c = tasks.and({start_date: {"$lte": start_date}}, end_date: {"$gte": end_date}).selector
      tasks_result = tasks.or(cond_a, cond_b, cond_c)
      tasks_result.to_a
    end

    def low_levelquery_tasks
      tasks = []
      batches = Cultivation::Batch.in(
        status: [
          Constants::BATCH_STATUS_SCHEDULED,
          Constants::BATCH_STATUS_ACTIVE,
        ],
      )
      batches.map do |batch|
        if batch.tasks.present?
          query_tasks = Cultivation::QueryTasks.call(batch).result
          query_tasks.map do |qt|
            unless qt.have_children?(query_tasks)
              tasks << qt.id
            end
          end
        end
      end
      tasks
    end
  end
end

module DailyTask
  class QueryTaskByDateRange
    prepend SimpleCommand

    def initialize(start_date, end_date, current_user = nil)
      @start_date = start_date
      @end_date = end_date
      @current_user = current_user
    end

    def call
      query_records
    end

    private

    def query_records
      if @current_user.present?
        tasks = @current_user.cultivation_tasks
      else
        tasks = Cultivation::Task.all
      end

      cond_a = tasks.and({end_date: {"$gte": @start_date}},
                         start_date: {"$lte": @end_date}).selector
      cond_b = tasks.and({start_date: {"$gte": @start_date}},
                         start_date: {"$lte": @end_date}).selector
      cond_c = tasks.and({start_date: {"$lte": @start_date}},
                         end_date: {"$gte": @end_date}).selector

      batch_ids = Cultivation::Batch.in(
        status: [
          Constants::BATCH_STATUS_SCHEDULED,
          Constants::BATCH_STATUS_ACTIVE,
        ],
      ).pluck(:_id)

      tasks_result = tasks.or(cond_a, cond_b, cond_c)
      tasks_result = tasks_result.in(batch_id: batch_ids)
      tasks_result = tasks_result.to_a

      start_date = Date.parse(@start_date)
      end_date = Date.parse(@end_date)

      dates = (start_date..end_date).to_a
      arr = []
      dates.each do |date|
        task_selected = tasks_result.select { |a| a[:start_date] <= date and a[:end_date] >= date }
        arr << {
          date: date,
          numberOfTasks: task_selected.count,
        }
      end

      return arr
    end
  end
end

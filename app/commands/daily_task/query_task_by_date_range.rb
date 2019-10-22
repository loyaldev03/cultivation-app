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

      tasks_result = tasks.collection.aggregate([
        {"$match": {
          "$or": [
            {"batch_status": {"$eq": Constants::BATCH_STATUS_SCHEDULED}},
            {"batch_status": {"$eq": Constants::BATCH_STATUS_ACTIVE}},
          ],
        }},
        {"$project": {
          start_date: 1,
          end_date: 1,
        }},
      ]).to_a

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

      arr
    end
  end
end

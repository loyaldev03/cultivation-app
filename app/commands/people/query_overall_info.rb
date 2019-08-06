module People
  class QueryOverallInfo
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      absent_rate = People::QueryAbsentRate.call(@user, @args).result
      tardiness_rate = People::QueryTardinessRate.call(@user, @args).result
      performance = 100.00 - tardiness_rate
      {
        employee_at_risk: 0,
        tardiness_rate: tardiness_rate,
        absent_rate: absent_rate,
        performance: performance,
      }
    end
  end
end

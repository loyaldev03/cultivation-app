module People
  class QueryOverallInfo
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      period = get_period_date(@args[:period].downcase)
      args = {
        facility_id: @args[:facility_id],
        start_date: period[:start_date],
        end_date: period[:end_date],
      }
      absent_rate = People::QueryAbsentRate.call(@user, args).result
      tardiness_rate = People::QueryTardinessRate.call(@user, args).result
      performance = 100.00 - tardiness_rate
      {
        employee_at_risk: 0, #getting requirements
        tardiness_rate: tardiness_rate,
        absent_rate: absent_rate,
        performance: performance,
      }
    end

    private

    def get_period_date(period)
      if period == 'all'
        {
          start_date: CompanyInfo.first.created_at,
          end_date: Time.now,
        }
      elsif period == 'this year'
        {
          start_date: Time.current.beginning_of_year,
          end_date: Time.current.end_of_year,
        }
      elsif period == 'this month'
        {
          start_date: Time.current.beginning_of_month,
          end_date: Time.current.end_of_month,
        }
      elsif period == 'this week'
        {
          start_date: Time.current.beginning_of_week,
          end_date: Time.current.end_of_week,
        }
      end
    end
  end
end

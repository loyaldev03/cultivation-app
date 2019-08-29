
module Common
  class QueryHolidayByYear
    prepend SimpleCommand

    def initialize(current_user, year)
      @current_user = current_user
      @year = year.to_i
    end

    def call
      @start_date = Date.new(@year).beginning_of_year
      @end_date = Date.new(@year).end_of_year
      cond_a = CompanyInfo.last.holidays.and({end_date: {"$gte": @start_date}},
                                             start_date: {"$lte": @end_date}).selector
      cond_b = CompanyInfo.last.holidays.and({start_date: {"$gte": @start_date}},
                                             start_date: {"$lte": @end_date}).selector
      cond_c = CompanyInfo.last.holidays.and({start_date: {"$lte": @start_date}},
                                             end_date: {"$gte": @end_date}).selector
      holidays = CompanyInfo.last.holidays.or(cond_a, cond_b, cond_c)
      chopped_holidays = []
      holidays.each do |holiday|
        if holiday.duration && holiday.duration > 1 #if duration more than 1 need to chopped
          #only chopped until end of current year
          current_date = holiday.start_date
          (1..holiday.duration).each do
            chopped_holidays << {
              title: holiday.title,
              duration: '',
              date: current_date,
              start_date: holiday.start_date.strftime('%Y-%m-%d '),
              end_date: holiday.end_date.strftime('%Y-%m-%d '),
            }
            current_date = current_date + 1.days
          end
        else
          chopped_holidays << {
            id: holiday.id.to_s,
            title: holiday.title,
            duration: '',
            date: holiday.start_date,
            start_date: holiday.start_date.strftime('%Y-%m-%d '),
            end_date: holiday.end_date.strftime('%Y-%m-%d '),
          }
        end
      end
      chopped_holidays
    end
  end
end

module Common
  class Holiday
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :date, type: Time
    field :start_date, type: Time
    field :end_date, type: Time
    field :duration, type: Integer

    field :title, type: String

    scope :year, -> (year) {
            where(:start_date.gte => Date.new(year).beginning_of_year, :end_date.lte => Date.new(year).end_of_year)
          }

    scope :expected_on, -> (date) {
            @start_date = date.beginning_of_day
            @end_date = date.end_of_day

            cond_a = self.and({end_date: {"$gte": @start_date}},
                              start_date: {"$lte": @end_date}).selector
            cond_b = self.and({start_date: {"$gte": @start_date}},
                              start_date: {"$lte": @end_date}).selector
            cond_c = self.and({start_date: {"$lte": @start_date}},
                              end_date: {"$gte": @end_date}).selector
            self.or(cond_a, cond_b, cond_c)
          }

    embedded_in :company_info, class_name: 'CompanyInfo'
  end
end

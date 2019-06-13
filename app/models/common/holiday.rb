module Common
  class Holiday
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :date, type: Time
    field :title, type: String

    scope :year, -> (year) {
            where(date: Date.new(year).beginning_of_year..Date.new(year).end_of_year)
          }

    embedded_in :company_info, class_name: 'CompanyInfo'
  end
end

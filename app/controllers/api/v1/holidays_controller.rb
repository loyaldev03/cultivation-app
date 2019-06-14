class Api::V1::HolidaysController < Api::V1::BaseApiController
  def index
    holidays = CompanyInfo.last.holidays.year(params[:year].to_i)
    render json: Common::HolidaySerializer.new(holidays).serialized_json
  end

  def create
    holiday = CompanyInfo.last.holidays.new({
      title: params[:holiday][:title],
      date: Time.zone.parse(params[:holiday][:date], Time.current),
    })
    holiday.save
    if holiday
      render json: {data: {message: 'success'}}
    end
  end
end

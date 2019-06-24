class Api::V1::HolidaysController < Api::V1::BaseApiController
  def index
    holidays = CompanyInfo.last.holidays.year(params[:year].to_i)

    render json: Common::HolidaySerializer.new(holidays).serialized_json
  end

  def show_by_date
    if params[:date]
      daterange = params[:date].to_datetime.utc.at_beginning_of_day..params[:date].to_datetime.utc.at_end_of_day
      holidays = CompanyInfo.last.holidays.where(date: daterange).first
    end
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

  def update
    holiday = CompanyInfo.last.holidays.find_by(id: "#{params[:id]}")

    if holiday
      holiday.title = params[:holiday][:title]
      holiday.date = Time.zone.parse(params[:holiday][:date], Time.current)
    end
    holiday.save
    if holiday
      render json: {data: {message: 'success'}}
    end
  end
end

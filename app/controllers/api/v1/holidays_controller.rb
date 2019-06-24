class Api::V1::HolidaysController < Api::V1::BaseApiController
  def index
    if params[:year]
      holidays = CompanyInfo.last.holidays.year(params[:year].to_i)
    elsif params[:date]
      daterange = params[:date].to_datetime.utc.at_beginning_of_day..params[:date].to_datetime.utc.at_end_of_day
      holidays = CompanyInfo.last.holidays.where(date: daterange).first
      Rails.logger.debug("DATEEEE===>#{daterange}")
      Rails.logger.debug("DATE HOLIDAYS===>#{holidays.inspect}")
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
    Rails.logger.debug("DATEEE===>#{params[:id]}")
    holiday = CompanyInfo.last.holidays.find_by(id: "#{params[:id]}")
    Rails.logger.debug("HOLIDAY===>#{holiday.inspect}")

    if holiday
      Rails.logger.debug("TITLE---->#{params[:holiday][:title]}")
      holiday.title = params[:holiday][:title]
      holiday.date = Time.zone.parse(params[:holiday][:date], Time.current)
    end
    holiday.save
    if holiday
      render json: {data: {message: 'success'}}
    end
  end
end

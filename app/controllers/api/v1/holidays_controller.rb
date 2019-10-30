class Api::V1::HolidaysController < Api::V1::BaseApiController
  def index
    cmd = Common::QueryHolidayByYear.call(current_user, params[:year])
    render json: {data: cmd.result}.to_json
  end

  def show_by_date
    if params[:date]
      @date = Time.zone.parse(params[:date])
      @holiday = CompanyInfo.last.holidays.expected_on(@date).first
    end
    render json: Common::HolidaySerializer.new(@holiday).serialized_json
  end

  def create
    start_date = Time.zone.parse(params[:holiday][:start_date], Time.current)
    duration = params[:holiday][:duration].to_i
    end_date = start_date + duration.days
    holiday = CompanyInfo.last.holidays.new({
      title: params[:holiday][:title],
      start_date: start_date,
      duration: duration,
      end_date: end_date,
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
      holiday.start_date = Time.zone.parse(params[:holiday][:start_date], Time.current)
      holiday.duration = params[:holiday][:duration]
      holiday.end_date = holiday.start_date + holiday.duration.to_i.days
    end
    holiday.save
    if holiday
      render json: {data: {message: 'success'}}
    end
  end
end

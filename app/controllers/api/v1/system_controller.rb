class Api::V1::SystemController < Api::V1::BaseApiController
  def configuration
    config = System::Configuration.first
    render json: {
      data: {
        current_time: config.current_time,
      },
    }
  end

  def update_configuration
    config = System::Configuration.first
    current_time = Time.zone.parse(params[:current_time]) if params[:current_time]
    if current_time && current_time&.is_a?(Time)
      config.enable_time_travel = true
      config.current_time = current_time
    else
      config.enable_time_travel = false
      Timecop.return
      config.current_time = Time.current
    end
    config.save!
    render json: {
      data: {
        "current_time": config.current_time,
      },
    }
  end
end

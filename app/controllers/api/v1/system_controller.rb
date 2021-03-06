class Api::V1::SystemController < Api::V1::BaseApiController
  def configuration
    config = System::Configuration.first || System::Configuration.new
    config.current_time ||= Time.current
    config.enable_time_travel ||= false

    render json: {
      data: {
        current_time: config.current_time,
        enable_time_travel: config.enable_time_travel,
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

    # Run worker to update batch status
    ActivateBatchWorker.new.perform

    render json: {
      data: {
        "current_time": config.current_time,
        "enable_time_travel": config.enable_time_travel,
      },
    }
  end
end

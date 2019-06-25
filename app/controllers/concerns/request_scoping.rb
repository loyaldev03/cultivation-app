module RequestScoping
  extend ActiveSupport::Concern

  included do
    before_action :set_rollbar_scope, if: :current_user
    around_action :set_timezone, if: :current_user
    around_action :set_timetravel, if: :current_user

    helper_method :current_default_facility
    helper_method :current_facility
    helper_method :current_ip_facility
  end

  protected

  def set_rollbar_scope
    Rollbar.scope!(
      person: {
        id: current_user.id.to_s,
        email: current_user.email,
        username: current_user.display_name,
        timezone: current_user.timezone,
      },
    )
  end

  def set_timetravel
    if ENV['ENABLE_TIME_TRAVEL'] == 'yes'
      time_travel
      yield
      time_travel_return
    else
      yield
    end
  end

  def time_travel
    config = System::Configuration.first
    if config&.enable_time_travel
      Rails.logger.info "\033[31m TIME TRAVEL ACTIVE \033[0m"
      Timecop.travel(config.current_time)
    else
      Timecop.return
    end
  end

  def time_travel_return
    Timecop.return
  end

  def set_timezone(&block)
    Time.use_zone(current_user.timezone, &block)
  end

  def current_ip_facility
    @current_default_facility ||= Facility.where(:whitelist_ips => request.remote_ip)
  end

  def current_default_facility
    if current_user.present?
      @current_default_facility ||= FindDefaultFacility.call(current_user).result
    end
  end

  def current_facility
    if @current_facility.blank? && params[:facility_id].present?
      @current_facility = Facility.find(params[:facility_id])
    elsif @current_facility.blank? && params[:facility_id].blank?
      @current_facility = FindDefaultFacility.call(current_user).result
    else
      @current_facility
    end
  end
end

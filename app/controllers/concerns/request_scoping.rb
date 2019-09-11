module RequestScoping
  extend ActiveSupport::Concern

  included do
    before_action :set_rollbar_scope, if: :current_user
    around_action :set_timezone, if: :current_user
    around_action :set_timetravel, if: :current_user

    helper_method :current_default_facility
    helper_method :current_facility
    helper_method :current_shared_facility_ids
    helper_method :current_ip_facility
    helper_method :company_info
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
    if ENV['ENABLE_WHITELIST_CHECKING'] == 'true'
      @current_ip_facility ||= Facility.where(whitelist_ips: request.remote_ip)
    else
      true
    end
  end

  def current_default_facility
    if current_user.present?
      @current_default_facility ||= FindDefaultFacility.call(current_user).result
    end
  end

  def current_facility
    if @current_facility.blank? && params[:facility_id].present?
      if params[:facility_id] == 'All'
        @current_facility = FindDefaultFacility.call(current_user).result
      else
        @current_facility = Facility.find(params[:facility_id])
      end
    elsif @current_facility.blank? && params[:facility_id].blank?
      @current_facility = FindDefaultFacility.call(current_user).result
    else
      @current_facility
    end
  end

  def current_shared_facility_ids
    if current_facility.nil?
      f_ids = Facility.where(id: {'$in': current_default_facility.shared_facility_ids}, is_enabled: true).pluck(:id)
      ids = f_ids.push(current_default_facility.id)
    else
      f_ids = Facility.where(id: {'$in': current_facility.shared_facility_ids}, is_enabled: true).pluck(:id)
      ids = f_ids.push(current_facility.id)
    end
  end

  def company_info
    @company_info ||= CompanyInfo.where({}).first
  end
end

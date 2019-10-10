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
    helper_method :active_facility_ids
    helper_method :resource_shared?
    helper_method :has_default_facility?
    helper_method :current_user_facilities
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
    if @current_default_facility.nil?
      @current_default_facility = if current_user.present?
                                    FindDefaultFacility.call(current_user).result
                                  end
    end
    @current_default_facility
  end

  # TODO: Change this to always return array.
  # - Return array with only the selected facility
  # - Return array with all enabled facility when 'All' is selected.
  def current_facility
    if @current_facility.nil? && params[:facility_id].present?
      if params[:facility_id] == 'All'
        @current_facility = FindDefaultFacility.call(current_user).result
      else
        @current_facility = Facility.find(params[:facility_id])
      end
    elsif @current_facility.nil? && params[:facility_id].blank?
      @current_facility = FindDefaultFacility.call(current_user).result
    else
      @current_facility
    end
  end

  def current_shared_facility_ids
    if current_user.nil? && current_facility.blank?
      return []
    end
    if current_facility.blank?
      f_ids = Facility.where(id: {'$in': current_default_facility.shared_facility_ids}, is_enabled: true).pluck(:id)
      ids = f_ids.push(current_default_facility.id)
    else
      f_ids = Facility.where(id: {'$in': current_facility.shared_facility_ids}, is_enabled: true).pluck(:id)
      ids = f_ids.push(current_facility.id)
    end
  end

  def current_user_facilities
    @current_user_facilities ||= QueryUserFacilities.call(current_user).result
  end

  def active_facility_ids
    @active_facility_ids ||= Facility.where(is_enabled: true).pluck(:id)
  end

  def resource_shared?
    @resource_shared ||= company_info.enable_resouces_sharing
  end

  def company_info
    @company_info ||= CompanyInfo.where({}).first
  end

  def has_default_facility?
    @has_default_facility ||= company_info&.is_active &&
                              current_default_facility.present?
  end
end

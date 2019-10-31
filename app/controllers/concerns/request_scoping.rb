module RequestScoping
  extend ActiveSupport::Concern

  included do
    before_action :set_rollbar_scope, if: :current_user
    around_action :set_timezone, if: :current_user
    around_action :set_timetravel, if: :current_user

    helper_method :current_default_facility
    helper_method :current_facility
    helper_method :current_user_facilities_ids
    helper_method :current_ip_facility
    helper_method :company_info
    helper_method :resource_shared?
    helper_method :current_user_facilities
    helper_method :selected_facilities_ids
    helper_method :select_single_facility
    helper_method :params_facility
    helper_method :params_facility_id
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

  def select_single_facility
    if selected_facilities_ids.any? && params[:facility_id] == 'All'
      return_url = url_for(params.except(:facility_id).to_unsafe_h)
      redirect_to select_facility_path(return_url: return_url)
    end
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

  # FIXME: DO NOT USE
  # - Return array with only the selected facility
  # - Return array with all enabled facility when 'All' is selected.
  # OBSOLETE: DO NOT USE
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

  def selected_facilities_ids
    param_fid = params[:facility_id]
    @selected_facilities_ids = if param_fid == 'All' || param_fid.blank?
                                 current_user_facilities_ids
                               else
                                 current_user_facilities_ids.select { |x| x.to_s == param_fid }
                               end
  end

  def params_facility
    @params_facility ||= current_user_facilities.detect { |f| f.id.to_s == params[:facility_id] }
  end

  def params_facility_id
    @params_facility_id ||= params[:facility_id]
  end

  def current_user_facilities
    @current_user_facilities ||= QueryUserFacilities.call(current_user).result
  end

  def current_user_facilities_ids
    current_user.facilities.blank? ? [] : current_user.facilities
  end

  def resource_shared?
    @resource_shared ||= company_info.enable_resouces_sharing
  end

  def company_info
    @company_info ||= CompanyInfo.where({}).first
  end
end

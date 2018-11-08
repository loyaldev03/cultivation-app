class ApplicationController < ActionController::Base
  before_action :miniprofiler
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_rollbar_scope, if: :current_user
  around_action :set_timezone, if: :current_user
  layout :layout_by_resource

  helper_method :current_default_facility
  helper_method :current_facility

  protected

  def set_rollbar_scope
    Rollbar.scope!(:person => {
                     :id => current_user.id.to_s,
                     :email => current_user.email,
                     :username => current_user.display_name,
                     :timezone => current_user.timezone,
                   })
  end

  def set_timezone(&block)
    Time.use_zone(current_user.timezone, &block)
    Rails.logger.debug "\033[34m BaseApiController::Time.use_zone:: #{current_user&.timezone} \033[0m"
  end

  def miniprofiler
    # Enable mini profiler only in development environment
    # DEBUG: Is your MongoDb Running?
    Rack::MiniProfiler.authorize_request if Rails.env.development?
  end

  def configure_permitted_parameters
    # Permit the `first_name` & `last_name` parameter along with the other sign up parameters.
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :timezone])
    devise_parameter_sanitizer.permit(:account_update, keys: [
                                                         :first_name,
                                                         :last_name,
                                                         :title,
                                                         :photo,
                                                         :timezone,
                                                       ])
  end

  def layout_by_resource
    if devise_controller? && action_name == 'new'
      'login'
    else
      'application'
    end
  end

  private

  def current_default_facility
    if current_user.present?
      @current_default_facility ||= FindDefaultFacility.call(current_user).result
    end
  end

  def current_facility
    @current_facility ||= FindFacility.call(id: params[:facility_id]).result if params[:facility_id].present?
  end
end

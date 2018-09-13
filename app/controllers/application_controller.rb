class ApplicationController < ActionController::Base
  before_action :miniprofiler
  before_action :authenticate_user!
  before_action :set_timezone
  before_action :configure_permitted_parameters, if: :devise_controller?
  layout :layout_by_resource

  protected

  def miniprofiler
    # Enable mini profiler only if developer login
    # DEBUG: Is your MongoDb Running?
    Rack::MiniProfiler.authorize_request if current_user && current_user.is_dev?
  end

  def set_timezone
    tz = current_user.timezone if user_signed_in?
    Time.zone = tz || ActiveSupport::TimeZone['Mountain Time (US & Canada)']
  end

  def configure_permitted_parameters
    # Permit the `first_name` & `last_name` parameter along with the other sign up parameters.
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :timezone])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :timezone])
  end

  def layout_by_resource
    if devise_controller? && action_name == "new"
      'login'
    else
      'application'
    end
  end
end

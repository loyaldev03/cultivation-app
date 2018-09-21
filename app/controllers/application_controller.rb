class ApplicationController < ActionController::Base
  before_action :miniprofiler
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_rollbar_scope, if: :current_user
  around_action :set_timezone, if: :current_user
  layout :layout_by_resource

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
  end

  def miniprofiler
    # Enable mini profiler only if developer login
    # DEBUG: Is your MongoDb Running?
    Rack::MiniProfiler.authorize_request if current_user && current_user.is_dev?
  end

  def configure_permitted_parameters
    # Permit the `first_name` & `last_name` parameter along with the other sign up parameters.
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :timezone])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :timezone])
  end

  def layout_by_resource
    if devise_controller? && action_name == 'new'
      'login'
    else
      'application'
    end
  end
end

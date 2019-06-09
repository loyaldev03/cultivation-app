class ApplicationController < ActionController::Base
  before_action :miniprofiler
  before_action :authenticate_user!
  include RequestScoping # After authenticate_user
  before_action :configure_permitted_parameters, if: :devise_controller?
  layout :layout_by_resource

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.json { head :forbidden, content_type: 'text/html' }
      format.html { redirect_to main_app.root_url, notice: exception.message }
      format.js { head :forbidden, content_type: 'text/html' }
    end
  end

  protected

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
                                                         :phone_number,
                                                         :address,
                                                         :password,
                                                         :password_confirmation,
                                                       ])
  end

  def layout_by_resource
    if devise_controller? && action_name == 'new'
      'login'
    elsif current_user.user_mode == 'worker'
      'worker'
    elsif ['admin', 'manager'].include? current_user.user_mode
      'application'
    end
  end
end

# app/controllers/registrations_controller.rb
class RegistrationsController < Devise::RegistrationsController

  protected

  def after_sign_up_path_for(resource)
    if CompanyInfo.count.zero?
      resource.user_mode = "admin"
      resource.save
      first_setup_path
    else
      root_path
    end
  end

  def update_resource(resource, params)
    if params[:password]
      resource.password = params[:password]
      resource.password_confirmation = params[:password_confirmation]
    end
    resource.update_without_password(params)
  end
end

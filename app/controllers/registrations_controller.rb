# app/controllers/registrations_controller.rb
class RegistrationsController < Devise::RegistrationsController
  # override devise "create" block
  def create
    super do
      if CompanyInfo.count.zero?
        resource.user_mode = "admin"
      end
      resource.save
    end
  end

  protected

  def after_sign_up_path_for(_resource)
    if CompanyInfo.count.zero?
      '/first_setup'
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

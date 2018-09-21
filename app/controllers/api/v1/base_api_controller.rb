# Pick and choose to follow guide here: https://github.com/vasilakisfil/rails5_api_tutorial
class Api::V1::BaseApiController < ActionController::API
  before_action :authenticate_user!
  before_action :set_rollbar_scope

  protected

  def set_rollbar_scope
    if current_user.present?
      Rollbar.scope!(:person => { :id => current_user.id.to_s, :email => current_user.email, :username => current_user.display_name })
    end
  end
end

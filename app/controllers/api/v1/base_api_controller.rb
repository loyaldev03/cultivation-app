# Pick and choose to follow guide here: https://github.com/vasilakisfil/rails5_api_tutorial
class Api::V1::BaseApiController < ActionController::API
  before_action :authenticate_user!
  before_action :set_rollbar_scope, if: :current_user
  around_action :set_timezone, if: :current_user

  protected

  def set_rollbar_scope
    Rollbar.scope!(person: {
                     id: current_user.id.to_s,
                     email: current_user.email,
                     username: current_user.display_name,
                     timezone: current_user.timezone,
                   })
  end

  def set_timezone(&block)
    Time.use_zone(current_user.timezone, &block)
  end
end

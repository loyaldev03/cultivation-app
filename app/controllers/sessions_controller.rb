class SessionsController < Devise::SessionsController
  before_action :get_user_role, only: :destroy

  private

  def get_user_role
    @user_role = current_user.user_mode
  end

  def after_sign_out_path_for(resource)
    if @user_role == 'worker'
      worker_login_index_path
    else
      super
    end
  end
end

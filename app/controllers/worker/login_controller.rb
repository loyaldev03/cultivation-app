class Worker::LoginController < ApplicationController
  layout 'worker_login'
  skip_before_action :authenticate_user!
  before_action :check_ip_whitelist
  before_action :check_if_logged_in

  def index
    if @ip_included
      @roles = Common::Role.pluck(:name)
      if params[:role].present?
        if params[:role] == 'all'
          @users = User.all
        else
          role = Common::Role.find_by(name: params[:role])
          @users = User.all_in(roles: [role.id]) if role.present?
        end
        @users = @users.order_by(last_sign_in_at: :asc) if params[:filter] == 'last_login'
        @users = @users.order_by(first_name: :asc) if params[:filter] == 'alpha'
        @users = @users.select { |a| "#{a['first_name']} #{a['last_name']}" =~ /#{params[:search]}/i } if params[:search].present?
        @user = @users.detect { |a| a[:id].to_s == params[:selected] } if params[:selected].present?
      end
    else
      flash[:notice] = 'Your public ip is not registered in the system'
      redirect_to root_path
    end
  end

  def generate_code
    @user = User.find(params[:selected])
    cmd = Common::GenerateCodeLogin.call(@user)
    if cmd.success?
      flash[:notice] == 'Your login OTP has been sent to your number'
      redirect_to worker_login_index_path(request.params.except(:controller, :_method, :action, :authenticity_token).merge(requested: true))
    else
    end
  end

  def check_code
    @user = User.find(params[:selected])
    cmd = Common::CheckCodeLogin.call(@user, {login_code: params[:user][:password].join('')})
    if cmd.success?
      sign_in(@user, scope: :user)
      redirect_to worker_dashboard_path
    else
      flash[:notice] == 'Error PIN'
      redirect_to worker_login_index_path(request.params.except(:controller, :_method, :action, :authenticity_token, :commit, :user).merge(requested: true))
    end
  end

  private

  def check_if_logged_in
    redirect_to root_path, notice: 'You have logged in' if user_signed_in?
  end

  def check_ip_whitelist
    @ip_included = current_ip_facility.present?
  end
end

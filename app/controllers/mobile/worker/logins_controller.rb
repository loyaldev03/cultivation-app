class Mobile::Worker::LoginsController < ApplicationController
  layout 'worker_login'
  skip_before_action :authenticate_user!
  before_action :check_ip_whitelist

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
        @users = @users.select { |a| "#{a['first_name']} #{a['last_name']}" == params[:search] } if params[:search].present?
        @user = @users.detect { |a| a[:id].to_s == params[:selected] } if params[:selected].present?
      end
    end
  end

  def generate_code
    @user = User.find(params[:user_id])
    cmd = Common::GenerateCodeLogin.call(@user)
    if cmd.success?
      flash[:notice] == 'Code sent to your number'
      redirect_to pin_request_mobile_worker_logins_path(user_id: params[:user_id])
    end
  end

  def check_code
    @user = User.find(params[:user_id])
    cmd = Common::CheckCodeLogin.call(@user, {login_code: params[:user][:password].join('')})
    if cmd.success?
      sign_in(@user, scope: :user)
      redirect_to mobile_worker_dashboards_path
    else
      flash[:notice] == 'Error PIN'
      redirect_to pin_request_mobile_worker_logins_path(user_id: params[:user_id])
    end
  end

  def pin_request
    @user = User.find(params[:user_id])
    @pin_available = @user.login_code_expired_at && @user.login_code_expired_at >= Time.now
  end

  private

  def check_ip_whitelist
    #comment out for now , how do we know current default facility if the user doesnt even log in yet ?
    #before it was checking user default_facility_id

    # facility = Facility.find(current_user.default_facility_id)
    @ip_included = true #facility.whitelist_ips.include? request.remote_ip
  end
end

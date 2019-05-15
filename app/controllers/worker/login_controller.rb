class Worker::LoginController < ApplicationController
  layout 'worker_login'
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
        @user = @users.detect { |a| "#{a['first_name']} #{a['last_name']}" == params[:selected] } if params[:selected].present?
      end
    end
  end

  private

  def check_ip_whitelist
    facility = Facility.find(current_user.default_facility_id)
    @ip_included = facility.whitelist_ips.include? request.remote_ip
  end
end

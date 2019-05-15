class Worker::LoginController < ApplicationController
  layout 'worker_login'
  before_action :check_ip_whitelist

  def index
  end

  private

  def check_ip_whitelist
    facility = Facility.find(current_user.default_facility_id)
    @ip_included = facility.whitelist_ips.include? request.remote_ip
  end
end

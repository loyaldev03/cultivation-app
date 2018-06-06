class ApplicationController < ActionController::Base
  before_action :miniprofiler

  private

  def miniprofiler
    # Enable mini profiler only if developer login
    Rack::MiniProfiler.authorize_request if current_user && current_user.is_dev?
  end
end

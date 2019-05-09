# Pick and choose to follow guide here: https://github.com/vasilakisfil/rails5_api_tutorial
class Api::V1::BaseApiController < ActionController::API
  before_action :authenticate_user!
  include RequestScoping
  include Pagy::Backend

  Pagy::VARS[:items] = 20

  # Override pagy_get_vars to make it work with mongoid count
  # and dynamic pageSize changes.
  def pagy_get_vars(collection, vars)
    vars[:count] ||= (c = collection.count).is_a?(Hash) ? c.size : c
    vars[:page] ||= params[:page]
    vars[:items] ||= params[:pageSize]
    vars
  end
end

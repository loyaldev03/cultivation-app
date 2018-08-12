# Pick and choose to follow guide here: https://github.com/vasilakisfil/rails5_api_tutorial
class Api::V1::BaseApiController < ActionController::API
  before_action :authenticate_user!
end

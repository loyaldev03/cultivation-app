class Api::V1::ManifestsController < Api::V1::BaseApiController
  def show
    cmd = Procurement::FindManifest.call(current_user, params)
    if cmd.success?
      render json: {manifest: cmd.result}
    else
      render json: {errors: cmd.errors}
    end
  end

  def create
    cmd = Procurement::SaveManifest.call(current_user, params)
    if cmd.success?
      render json: {manifest: cmd.result}
    else
      render json: {errors: cmd.errors}
    end
  end
end

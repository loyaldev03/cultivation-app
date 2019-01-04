class Api::V1::FacilitiesController < Api::V1::BaseApiController
  def search_locations
    # Rails.logger.debug "\033[34m Faclity ID: #{params[:facility_id]} \033[0m"
    command = QueryAllValidFacilityLocations.call(facility_id: params[:facility_id])
    if command.success?
      render json: {data: command.result}
    else
      render json: {error: command.errors}
    end
  end
end

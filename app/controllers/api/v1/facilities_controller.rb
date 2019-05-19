class Api::V1::FacilitiesController < Api::V1::BaseApiController
  def search_locations
    # Rails.logger.debug "\033[34m Faclity ID: #{params[:facility_id]} \033[0m"
    command = QueryAllValidFacilityLocations.call(facility_id: params[:id])
    if command.success?
      render json: {data: command.result, status: 200}
    else
      render json: {error: command.errors, status: 400}
    end
  end

  def locations
    facility_id = params[:id]
    purposes = params[:purposes] || []
    locations = QueryLocations.select_options(facility_id, purposes)
    render json: {data: locations.as_json}
  end

  def current_trays_summary
    facility_id = params[:id]
    summary_cmd = QueryFacilitySummary.call(facility_id: facility_id)

    render json: {data: summary_cmd.result.as_json}
  end
end

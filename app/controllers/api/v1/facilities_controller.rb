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
    purposes = params[:purposes] || []
    trays = QueryAvailableTrays.call(
      facility_id: facility_id,
      purpose: purposes,
      start_date: Time.current.beginning_of_day,
      end_date: Time.current.end_of_day,
    )

    render json: {data: trays.as_json}
  end
end

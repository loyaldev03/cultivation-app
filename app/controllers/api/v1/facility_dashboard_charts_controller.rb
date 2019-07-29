class Api::V1::FacilityDashboardChartsController < Api::V1::BaseApiController
  def facility_overview
    # NOTE : should be re write the code for test_results not facility_strain
    result = Charts::FacilityOverview.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end
end

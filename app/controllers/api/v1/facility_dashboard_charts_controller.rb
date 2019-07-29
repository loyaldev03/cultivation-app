class Api::V1::FacilityDashboardChartsController < Api::V1::BaseApiController
  def facility_overview
    result = Charts::FacilityOverview.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def rooms_capacity
    result = Charts::RoomsCapacity.call(current_user, {facility_id: params[:facility_id]}).result
    render json: result.to_json, status: 200
  end

  def room_detail
    result = Charts::RoomDetail.call(current_user, {facility_id: params[:facility_id], purpose: params[:purpose], name: params[:name], full_code: params[:full_code]}).result
    render json: result.to_json, status: 200
  end
end

class Settings::Facility::FacilitiesController < ApplicationController
  def index
    # render plain: 'facilities root'
    @facilities = Facility.all
  end

  def all
    # render plain: 'facilities listing'
  end

  def edit
    @facility = FacilitiesForm::FacilityUpdate.find(params[:id])
  end

  def update
    @facility = FacilitiesForm::FacilityUpdate.find(params[:id])
    if @facility.update(facility_params)
      redirect_to settings_facility_facilities_path
    else
      render 'edit'
    end
  end

  def facility_params
    params.require(:facilities_form_facility_update).permit(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)
  end
end

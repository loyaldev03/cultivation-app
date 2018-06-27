class Settings::Facilities::FacilitiesController < ApplicationController
  def index
    # render plain: 'facilities root'
    @facilities = Facility.all
  end

  def all
    # render plain: 'facilities listing'
  end

  def edit
    @facility = FacilitiesForm::FacilityUpdate.find(params[:id])
    render 'edit', layout: 'blank'
  end

  def update
    @facility = FacilitiesForm::FacilityUpdate.find(params[:id])
    if @facility.update(facility_params)
      # redirect_to settings_facility_facilities_path
      render 'reload'
    else
      render 'edit'
    end
  end

  def facility_params
    params.require(:facilities_form_facility_update).permit(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)
  end
end

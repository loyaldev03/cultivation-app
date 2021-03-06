class Settings::Facilities::FacilitiesController < ApplicationController
  def index
    @facilities = Facility.all
  end

  def all
  end

  def edit
    @wizard_form = FacilityWizardForm::BasicInfoForm.new(params[:id])
    @facility = FacilitiesForm::FacilityUpdate.find(params[:id])
    render 'edit', layout: nil

    # if request.xhr?
    #   render 'edit', layout: nil
    # end
  end

  def destroy
    command = DestroyFacility.call(current_user, params[:id])
    if command.success?
      render 'layouts/hide_sidebar', layouts: nil, locals: {message: 'Facility successfully deleted'}
    else
      flash[:error] = 'Unable to delete'
      render 'edit', layout: nil
    end
  end

  def update
    @facility = FacilitiesForm::FacilityUpdate.find(params[:id])
    if @facility.update(facility_params)
      render 'layouts/hide_sidebar', layout: nil
    else
      render 'edit', layout: nil
    end
  end

  private

  def facility_params
    params.require(:facilities_form_facility_update).permit(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)
  end
end

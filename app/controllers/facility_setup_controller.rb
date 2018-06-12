class FacilitySetupController < ApplicationController
  layout 'blank'

  def new
    # starting point of the facility wizard
    # @form_object = FacilitySetupForm.new
    @form_object = Facility.new
  end

  def create
    @form_object = Facility.new(facility_params)
    if @form_object.save
      # yay
      render :new
    else
      render :new
    end
  end

  private

  def facility_params
    params.require(:facility).permit(:code, :address)
  end
end

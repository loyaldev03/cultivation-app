class FacilitySetupController < ApplicationController
  layout 'blank'

  def save
    current_step = params['step'] || 1
    next_step = current_step.next

    if current_step == 1
      @facility = Facility.new(facility_params)
    else
      @facility = Facility.find(params[:facility_id])
    end

    if @facility.save
      # continue to next step or show summary
      redirect_to current_step != '6' ?
                    facility_setup_wizard_path(facility_id: @facility.id, step: next_step) :
                    facility_setup_summary_path(facility_id: @facility.id)
    else
      render "facility_setup/step#{current_step}"
    end
  end

  def wizard
    @current_step = params['step'] || 1
    # @facility = FacilitySetupForm.new
    @facility = @current_step == 1 ? Facility.new : Facility.find(params[:facility_id])
    render "facility_setup/step#{@current_step}"
  end

  def summary
    @facility = Facility.find(params[:facility_id])
  end

  private

  def facility_params
    params.require(:facility).permit(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)
  end
end

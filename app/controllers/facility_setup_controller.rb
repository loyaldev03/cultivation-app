class FacilitySetupController < ApplicationController
  layout 'blank'

  def save
    current_step = params['step'] || 1
    next_step = current_step.next

    Rails.logger.debug "===== GOTO current_step: #{current_step}"

    if current_step == 1
      @facility = Facility.new(facility_params)
    else
      @facility = Facility.find(params[:facility_id])
    end

    if @facility.save
      Rails.logger.debug "===== GOTO Next step"
      # continue to next step
      redirect_to facility_setup_wizard_path(facility_id: @facility.id, step: next_step)
    else
      Rails.logger.debug "===== GOTO Current step"
      render "facility_setup/step#{current_step}"
    end
  end

  def wizard
    @current_step = params['step'] || 1
    # @facility = FacilitySetupForm.new
    @facility = @current_step == 1 ? Facility.new : Facility.find(params[:facility_id])
    render "facility_setup/step#{@current_step}"
  end

  private

  def facility_params
    params.require(:facility).permit(:name, :code, :address, :zipcode, :city, :state, :country, :phone, :fax)
  end
end

class Settings::Company::MetrcIntegrationsController < ApplicationController
  authorize_resource class: false
  before_action :set_company

  def metrc_setup
  end

  def show
  end

  def update
    @company_info.metrc_user_key = company_info_params[:metrc_user_key]
    @company_info.enable_metrc_integration = company_info_params[:enable_metrc_integration]
    if @company_info.save
      flash[:notice] = 'Updated'
      redirect_to metrc_setup_settings_company_metrc_integrations_path
    else
      render 'metrc_setup'
    end
  end

  def update_metrc
    metrc_hist = current_facility.
      metrc_histories.
      find_or_create_by(code: params[:code])

    if metrc_hist
      metrc_hist.value = Time.current
      metrc_hist.save
    end

    metrc = params[:type].constantize
    if params[:facility_id]
      metrc.perform_async params[:facility_id]
    else
      metrc.perform_async
    end

    flash[:notice] = 'Metrc updated'
    redirect_to metrc_setup_settings_company_metrc_integrations_path
  end

  private

  def set_company
    # Because there's only 1 company per host
    @company_info = CompanyInfo.first
  end

  def company_info_params
    params.require(:company_info).permit(:metrc_user_key,
                                         :enable_metrc_integration)
  end
end

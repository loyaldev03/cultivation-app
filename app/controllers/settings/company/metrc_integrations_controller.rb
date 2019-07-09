class Settings::Company::MetrcIntegrationsController < ApplicationController
  authorize_resource class: false
  before_action :get_company

  def metrc_setup
  end

  def show
  end

  def update
    @company_info.metrc_user_key = company_info_params[:metrc_user_key]
    if @company_info.save
      flash[:notice] = 'Metrc Integration info saved'
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

  def get_company
    @company_info = CompanyInfo.last
  end

  def company_info_params
    params.require(:company_info).permit(:metrc_user_key)
  end
end

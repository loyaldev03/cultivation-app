class Settings::Company::MetrcIntegrationsController < ApplicationController
  before_action :get_company

  def metrc_setup
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

  private

  def get_company
    @company_info = CompanyInfo.last
  end

  def company_info_params
    params.require(:company_info).permit(:metrc_user_key)
  end
end

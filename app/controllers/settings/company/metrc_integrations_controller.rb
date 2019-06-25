class Settings::Company::MetrcIntegrationsController < ApplicationController
  authorize_resource class: false
  before_action :get_company

  def metrc_setup
    @metrc_histories = @company_info.metrc_histories
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
    metrc = params[:type].constantize
    metrc.perform_async
    metrc_hist = @company_info.metrc_histories.find_by(metrc_type: params[:type])
    if metrc_hist
      metrc_hist.update(value: DateTime.now)
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

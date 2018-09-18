class Settings::Company::CompanyInfoController < ApplicationController
  def edit
    @company_info = CompanyInfo.last
    if @company_info.nil?
      @company_info = CompanyInfo.new
      @company_info.save!
    end
  end

  def update
    @company_info = CompanyInfo.last
    @company_info.name = company_info_params[:name]
    @company_info.phone = company_info_params[:phone]
    @company_info.fax = company_info_params[:fax]
    @company_info.website = company_info_params[:website]
    @company_info.state_license = company_info_params[:state_license]
    @company_info.tax_id = company_info_params[:tax_id]
    @company_info.timezone = company_info_params[:timezone]
    @company_info.save!
  end

  private

  def company_info_params
    params.require(:company_info).permit(
      :name,
      :phone,
      :fax,
      :website,
      :state_license,
      :tax_id,
      :timezone
    )
  end
end
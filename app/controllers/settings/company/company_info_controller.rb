class Settings::Company::CompanyInfoController < ApplicationController
  def edit
    @company_info = CompanyInfo.last
    @facilities = Facility.all
    @work_schedules = @company_info.work_schedules
      .map { |a|
      {
        day: a[:day],
        start_time: a[:start_time]&.strftime('%H:%M'),
        end_time: a[:end_time]&.strftime('%H:%M'),
      }
    }
    @sunday = @work_schedules.detect { |a| a[:day] == 'sunday' } || {}
    @monday = @work_schedules.detect { |a| a[:day] == 'monday' } || {}
    @tuesday = @work_schedules.detect { |a| a[:day] == 'tuesday' } || {}
    @wednesday = @work_schedules.detect { |a| a[:day] == 'wednesday' } || {}
    @thursday = @work_schedules.detect { |a| a[:day] == 'thursday' } || {}
    @friday = @work_schedules.detect { |a| a[:day] == 'friday' } || {}
    @saturday = @work_schedules.detect { |a| a[:day] == 'saturday' } || {}

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

    if company_info_params[:work_schedules].present?
      @company_info.work_schedules = [] #clear work_schedules
      days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      days.each do |a| # insert back work_schedules
        day = company_info_params[:work_schedules].first[a]
        @company_info.work_schedules.build({
          day: a,
          start_time: day[:start_time],
          end_time: day[:end_time],
        })
      end
    end

    if @company_info.save
      flash[:notice] = 'Company info saved'
      redirect_to edit_settings_company_company_info_path
    else
      render 'edit'
    end
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
      :timezone,
      work_schedules: [monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {}, saturday: {}, sunday: {}],
    )
  end
end

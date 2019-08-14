class Settings::Company::CompanyInfoController < ApplicationController
  authorize_resource class: false

  def edit
    @facilities = Facility.all
    @company_info = get_company_info
    @work_schedules = @company_info.work_schedules.map do |a|
      {
        day: a[:day],
        start_time: a[:start_time]&.strftime('%H:%M'),
        end_time: a[:end_time]&.strftime('%H:%M'),
      }
    end
    @sunday = @work_schedules.detect { |a| a[:day] == 'sunday' } || {}
    @monday = @work_schedules.detect { |a| a[:day] == 'monday' } || {}
    @tuesday = @work_schedules.detect { |a| a[:day] == 'tuesday' } || {}
    @wednesday = @work_schedules.detect { |a| a[:day] == 'wednesday' } || {}
    @thursday = @work_schedules.detect { |a| a[:day] == 'thursday' } || {}
    @friday = @work_schedules.detect { |a| a[:day] == 'friday' } || {}
    @saturday = @work_schedules.detect { |a| a[:day] == 'saturday' } || {}
  end

  def get_company_info
    info = ::CompanyInfo.last
    if info.blank?
      info = ::CompanyInfo.new
      work_days.each do |a|
        info.work_schedules.build(day: a)
      end
      info.save!
      info
    end
    info
  end

  def work_days
    @work_days ||= ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  end

  def set_default_work_schedules(company_info)
    company_info.work_schedules = []
    now = Time.current.beginning_of_year
    start_time = Time.zone.local(now.year,
                                 now.month,
                                 now.day,
                                 8, 0, 0)
    end_time = Time.zone.local(now.year,
                               now.month,
                               now.day,
                               17, 0, 0)
    work_days.each do |day|
      company_info.work_schedules.build(
        day: day,
        start_time: start_time,
        end_time: end_time,
      )
    end
  end

  def set_user_default_timezone(company_info)
    # Set company timezone to user during initial setup
    # At this point, there's no facility yet.
    if company_info.timezone && current_default_facility.nil?
      current_user.timezone = company_info.timezone
      current_user.save
    end
  end

  def update
    @company_info = get_company_info
    @company_info.name = company_info_params[:name]
    @company_info.phone = company_info_params[:phone]
    @company_info.fax = company_info_params[:fax]
    @company_info.website = company_info_params[:website]
    @company_info.state_license = company_info_params[:state_license]
    @company_info.tax_id = company_info_params[:tax_id]
    @company_info.enable_metrc_integration = company_info_params[:enable_metrc_integration]
    @company_info.metrc_user_key = company_info_params[:metrc_user_key]

    if company_info_params[:timezone].present?
      @company_info.timezone = company_info_params[:timezone]
    end

    if @company_info.enable_metrc_integration &&
       @company_info.metrc_user_key
      MetrcOnboardingWorker.perform_async
    end

    Time.use_zone(@company_info.timezone) do
      if !@company_info.is_active
        set_user_default_timezone(@company_info)
        set_default_work_schedules(@company_info)
        @company_info.is_active = true
      end

      if company_info_params[:work_schedules].present?
        @company_info.work_schedules = [] # delete existing work_schedules
        work_days.each do |a| # insert back work_schedules
          day = company_info_params[:work_schedules].first[a]
          @company_info.work_schedules.build(
            day: a,
            start_time: day[:start_time],
            end_time: day[:end_time],
          )
        end
      end
    end

    if @company_info.save
      flash[:notice] = 'Company info saved'
      if params[:onboarding_type].present?
        @facility = Facility.find(params[:facility_id])
        @facility.update_onboarding('ONBOARDING_COMP_INFO')
      end
      redirect_to edit_settings_company_company_info_path(
        type: params[:type],
      )
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
      :enable_metrc_integration,
      :metrc_user_key,
      work_schedules: [monday: {},
                       tuesday: {},
                       wednesday: {},
                       thursday: {},
                       friday: {},
                       saturday: {},
                       sunday: {}],
    )
  end
end

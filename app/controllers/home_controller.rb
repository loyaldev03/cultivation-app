class HomeController < ApplicationController
  include WorkersDashboard
  before_action :verify_facility_setup, except: [:index]

  def index
    authorize! :index, HomeController
    @home = HomeSetupStatus.call(current_default_facility).result
    if !@home.have_company
      respond_to do |format|
        format.html { render layout: 'wizards/facility_setup' }
      end
    end
  end

  def dashboard
    if ['manager', 'admin'].include? current_user.user_mode
      @dashboard = DashboardForm::DashboardForm.new
      @batches = Cultivation::Batch.all.active.map do |b|
        {
          id: b.id.to_s,
          name: b.name,
        }
      end
    else
      redirect_to worker_dashboard_path
    end
  end

  def employees
    authorize! :employees, HomeController
  end

  def employees_schedule
    authorize! :employees_schedule, HomeController
  end

  def timesheets
    authorize! :timesheets, HomeController
  end

  def cult_batches
    authorize! :cult_batches, HomeController
  end

  def cult_plants
    authorize! :cult_plants, HomeController
  end

  def cult_destroyed_plants
    authorize! :cult_destroyed_plants, HomeController
  end

  def cult_wastes
    authorize! :cult_wastes, HomeController
  end

  def cult_tasks
    authorize! :cult_tasks, HomeController
  end

  def cult_issues
    authorize! :cult_issues, HomeController
  end

  def employees_dashboard
    authorize! :employees_dashboard, HomeController
  end

  def settings
    authorize! :settings, HomeController
  end

  def prod_unsold
    @facility_strains = Inventory::QueryFacilityStrains.call(params[:facility_id]).result
    @sales_catalogue = Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, 'raw_sales_product').result
    @drawdown_uoms = Common::UnitOfMeasure.where(dimension: 'weight').map &:unit

    strains = Inventory::FacilityStrain.where(facility: current_facility).pluck(:id)
    harvest_batches = Inventory::HarvestBatch.in(facility_strain: strains)
    options = {params: {include: [:facility]}}
    @harvest_batches = Inventory::HarvestBatchSerializer.new(harvest_batches, options).serializable_hash[:data]
    current_facility_id = params[:facility_id] == 'All' ? current_shared_facility_ids : current_facility.id
    @users = User.in(facilities: current_facility_id).map do |u|
      {
        id: u.id.to_s,
        name: u.display_name,
      }
    end
  end

  def requests
    @work_applications = current_user.work_applications.includes(:user)
    @work_applications = @work_applications.map do |a|
      {
        id: a.id,
        display_name: a.user.display_name,
        roles: a.user.display_roles.to_sentence,
        photo_url: a.user.photo_url,
        request_type: a.request_type,
        date: get_date_worker(a),
        status: a.status,
      }
    end
  end

  def update_requests
    @work_application = current_user.work_applications.find(params[:work_request_id])
    if params[:type] == 'rejected'
      @work_application.update(status: 'rejected')
    elsif params[:type] == 'approved'
      @work_application.update(status: 'approved')
    end
    redirect_to requests_path
  end

  def worker_dashboard
    @total_tasks = get_tasks_today.count
    @next_payment_date = QueryNextPaymentDate.call(Time.current).result
    @hours_worked = get_hours_worked
    render 'worker_dashboard', layout: 'worker'
    authorize! :worker_dashboard, HomeController
  end

  def worker_schedule
    @total_tasks = get_tasks_today.count
    @next_payment_date = QueryNextPaymentDate.call(Time.current).result
    @hours_worked = get_hours_worked
    render 'worker_schedule', layout: 'worker'
    authorize! :worker_schedule, HomeController
  end

  def inventory_setup
    authorize! :inventory_setup, HomeController
    @strains_count = Inventory::FacilityStrain.count
  end

  def reset_data
    Cultivation::TrayPlan.destroy_all
    Cultivation::Task.destroy_all
    Cultivation::NutrientProfile.destroy_all

    Inventory::Plant.destroy_all
    Inventory::ItemTransaction.destroy_all
    Inventory::VendorInvoice.destroy_all
    Inventory::PurchaseOrder.destroy_all
    Inventory::Vendor.destroy_all
    Cultivation::Batch.destroy_all
    CompanyInfo.destroy_all

    Common::UnitOfMeasure.delete_all
    Common::SeedUnitOfMeasure.call
    Inventory::SeedCatalogue.call

    User.update_all(facilities: [], default_facility_id: nil)

    # Preserve facility F0X
    f = Facility.find_by(code: 'F0X')
    t = []
    if f.present?
      f.rooms.each do |r|
        r.rows.each do |rw|
          rw.shelves.each do |sh|
            t.concat sh.tray_ids
          end
        end
      end
    end

    if f.present?
      Inventory::FacilityStrain.not.where(facility: f).destroy_all
      Tray.where(id: {:$not => {:$in => t}}).destroy_all
      Facility.not.where(id: f.id).destroy_all
    else
      Inventory::FacilityStrain.delete_all
      Tray.delete_all
      Facility.delete_all
    end

    redirect_to root_path, flash: {notice: 'Data has reset.'}
  end

  def onboarding
    if params[:facility_id].nil?
      @facility = nil
      @onboarding_count = 0
      return
    end
    @facility = Facility.find(params[:facility_id])
    if @facility.nil?
      @onboarding_count = 0
    else
      @onboarding_count = @facility.preferences.ne(code: 'ONBOARDING_DONE').map { |x| x if x.value == true }.compact.count
      if @facility.onboarding_val('ONBOARDING_DONE') == true
        redirect_to dashboard_cultivation_batches_path
      end
    end
  end

  private

  def get_date_worker(work_request)
    if work_request.request_type == 'OT'
      "#{work_request.start_time.strftime('%D %R')} - #{work_request.end_time.strftime('%D %R')}"
    else
      "#{work_request.start_time.strftime('%D')} - #{work_request.end_time.strftime('%D')}"
    end
  end

  def get_tasks_today
    @tasks_date = Time.current.beginning_of_day
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector
    Cultivation::Task.collection.aggregate(
      [
        {"$match": match},
      ],
    )
  end
end

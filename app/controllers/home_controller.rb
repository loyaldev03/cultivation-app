class HomeController < ApplicationController
  include WorkersDashboard

  def index
    @home = HomeSetupStatus.call(current_default_facility).result
  end

  def dashboard
    if ['manager', 'admin'].include? current_user.user_mode
      @dashboard = DashboardForm::DashboardForm.new
    else
      redirect_to worker_dashboard_path
    end
  end

  def employees
  end

  def employees_schedule
  end

  def timesheets
  end

  def requests
  end

  def worker_dashboard
    @total_tasks = get_tasks_today.count
    @next_payment_date = QueryNextPaymentDate.call(Time.current).result
    @hours_worked = get_hours_worked
    render 'worker_dashboard', layout: 'worker'
  end

  def inventory_setup
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

  private

  def get_tasks_today
    @tasks_date = Time.current.beginning_of_day
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector
    Cultivation::Task.collection.aggregate(
      [
        {"$match": match},
      ]
    )
  end
end

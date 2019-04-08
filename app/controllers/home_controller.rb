class HomeController < ApplicationController
  def index
    @home = HomeSetupStatus.call(current_default_facility).result
  end

  def dashboard
    @dashboard = DashboardForm::DashboardForm.new
  end

  def worker_dashboard
    @total_tasks = get_tasks_today.count
    @next_payment_date = QueryNextPaymentDate.call(DateTime.now).result
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
    @tasks_date = DateTime.now.beginning_of_day
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector
    Cultivation::Task.collection.aggregate(
      [
        {"$match": match},
      ]
    )
  end

  def get_hours_worked
    time_logs = current_user.time_logs.where(
      :start_time.gte => DateTime.now.beginning_of_week,
      :end_time.lte => DateTime.now.end_of_week,
    )

    sum_minutes = 0.0
    time_logs.each do |time_log|
      if time_log.start_time and time_log.end_time
        result = Cultivation::CalculateTaskActualCostAndHours.call(time_log.id.to_s).result
        sum_minutes += result[:actual_minutes]
      end
    end
    actual_hours = sum_minutes / 60 #convert to hours
    actual_hours.round(2)
  end
end

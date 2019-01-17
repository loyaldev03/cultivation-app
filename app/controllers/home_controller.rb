class HomeController < ApplicationController
  def index
    @home = HomeSetupStatus.call(current_default_facility).result
  end

  def dashboard
    @dashboard = DashboardForm::DashboardForm.new
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
end

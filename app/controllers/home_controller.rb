class HomeController < ApplicationController
  def index
    @home = OpenStruct.new({
      last_facility: Facility.last,
      has_inventories: Inventory::ItemArticle.all.any?,
      has_batches: Cultivation::Batch.all.any?,
    })
  end

  def dashboard
    @dashboard = DashboardForm::DashboardForm.new
  end

  def inventory_setup
  end

  def reset_data
    Cultivation::TrayPlan.destroy_all
    Inventory::RawMaterial.destroy_all
    Cultivation::Item.destroy_all
    Cultivation::Task.destroy_all
    Cultivation::NutrientProfile.destroy_all

    Inventory::Plant.destroy_all
    Inventory::ItemArticle.destroy_all
    Inventory::ItemTransaction.destroy_all
    Inventory::RawMaterial.destroy_all
    Inventory::VendorInvoice.destroy_all
    Inventory::Vendor.destroy_all
    Inventory::Item.destroy_all
    Cultivation::Batch.destroy_all
    Common::UnitOfMeasure.destroy_all
    CompanyInfo.destroy_all

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
      Inventory::FacilityStrain.destroy_all
      Tray.destroy_all
      Facility.destroy_all
    end

    redirect_to root_path, flash: {notice: 'Data has reset.'}
  end
end

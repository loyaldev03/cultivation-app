class HomeController < ApplicationController
  def index
    if Facility.count == 0
      @home = OpenStruct.new({
        last_facility: nil,
        has_inventories: false,
        has_batches: false,
      })
    else
      facility = Facility.last
      @home = OpenStruct.new({
        last_facility: facility,
        has_inventories: facility.strains.count > 0,
        has_batches: Cultivation::Batch.where(facility_id: facility.id).count > 0,
      })
    end
  end

  def dashboard
    @dashboard = DashboardForm::DashboardForm.new
  end

  def inventory_setup
    @strains_count = Inventory::FacilityStrain.count
    raw_material_catalogues = Inventory::ItemTransaction.where(catalogue_type: 'raw_materials')
    @raw_material_count = Inventory::ItemTransaction.in(catalogue: raw_material_catalogues).count
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

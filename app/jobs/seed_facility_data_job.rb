class SeedFacilityDataJob < ApplicationJob
  queue_as :default

  def perform(args = {})
    # Seed built-in roles
    @args = args
    seed_roles
    seed_uom
    seed_raw_materials
  end

  private

  def seed_roles
    # Find the Super Admin role in the system
    sa_role = Common::Role.find_by(name: Constants::SUPER_ADMIN, built_in: true)

    # Seed built-in roles
    if sa_role.nil?
      sa_role = Common::Role.create!({name: Constants::SUPER_ADMIN, built_in: true})
    end
  end

  def seed_raw_materials
    Inventory::CreateRawMaterials.call({facility_id: @args[:facility_id]})
  end

  def seed_uom
    Common::SeedUnitOfMeasure.call
  end
end

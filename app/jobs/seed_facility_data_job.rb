class SeedFacilityDataJob < ApplicationJob
  queue_as :default

  def perform(args = {})
    args = {
      current_user_id: nil, # String, User.id
      facility_id: nil,     # String, Facility.id
    }.merge(args)

    raise ArgumentError, 'current_user_id' if args[:facility_id].nil?
    raise ArgumentError, 'facility_id' if args[:facility_id].nil?

    @current_user_id = args[:current_user_id]
    @facility_id = args[:facility_id]

    # Seed built-in roles
    seed_facility_users
    seed_uom
    seed_raw_materials
    seed_preferences
  rescue StandardError => error
    Rollbar.error(error)
  end

  private

  def seed_facility_users
    SeedUserDefaultFacility.call(@current_user_id, @facility_id)
  end

  def seed_raw_materials
    Inventory::SeedCatalogue.call(facility_id: @facility_id)
  end

  def seed_preferences
    Common::SeedOnboardingPreference.call(@facility_id)
  end

  def seed_uom
    Common::SeedUnitOfMeasure.call
  end
end

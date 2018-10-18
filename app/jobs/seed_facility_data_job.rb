class SeedFacilityDataJob < ApplicationJob
  queue_as :default

  def perform(facility_id, current_user_id)
    facility = Facility.find(facility_id.to_bson_id)

    # The person who created the Facility
    super_admin = User.find(current_user_id.to_bson_id)

    # Assign Super Admin role to user
    seed_and_update_admin_role(super_admin)

    super_admin.save!
  end

  private

  def seed_and_update_admin_role(super_admin)
    # Find the Super Admin role in the system
    sa_role = Common::Role.find_by(name: Constants::SUPER_ADMIN, built_in: true)

    # Seed built-in roles
    if sa_role.nil?
      sa_role = Common::Role.create!({name: Constants::SUPER_ADMIN, built_in: true})
    end

    # Assign the Super Admin role to creator
    super_admin.roles << sa_role.id.to_s
  end
end

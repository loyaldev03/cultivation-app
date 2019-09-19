class SeedCompanyData
  include Sidekiq::Worker

  def perform(current_user_id)
    raise ArgumentError, 'current_user_id' if current_user_id.blank?

    @current_user_id = current_user_id.to_bson_id

    seed_roles
  end

  private

  def seed_roles
    # Find the Super Admin role in the system
    sa_role = Common::Role.find_by(name: Constants::SUPER_ADMIN, built_in: true)

    # Seed built-in roles
    if sa_role.nil?
      sa_role = Common::Role.create!(name: Constants::SUPER_ADMIN, built_in: true)
    end

    assign_default_superadmin(sa_role.id)
  end

  def assign_default_superadmin(sa_role_id)
    # Assign current user as superadmin if there's only 1 user in the database.
    # This usually only happen during initial company setup.
    if User.count == 1
      current_user = User.find_by(id: @current_user_id)

      if current_user.roles.blank?
        current_user.roles = [sa_role_id]
        current_user.save!
      end
    end
  end
end

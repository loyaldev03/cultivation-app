class RoleCheck
  prepend SimpleCommand

  def initialize(current_user, feature, permissions)
    # READ = Permission 1 
    # UPDATE = Permission 2
    # CREATE = Permission 4
    # DELETE = Permission 8

    # NOTE: Exception if missing required params
    raise ArgumentError.new('Missing "current_user"') if current_user.blank?
    raise ArgumentError.new('Missing "feature"') if feature.blank?
    raise ArgumentError.new('Missing "permissions"') if permissions.blank?

    @current_user = current_user
    @feature = feature
    @permissions = permissions
  end

  def call
    roles = Common::Role.where(:_id.in => u.roles)
  end
end

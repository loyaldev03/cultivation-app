class RoleCheck
  prepend SimpleCommand

  def initialize(current_user, feature, permissions)
    # READ = Permission 1
    # UPDATE = Permission 2
    # CREATE = Permission 4
    # DELETE = Permission 8

    # Exception if missing required params
    raise ArgumentError.new('Missing "current_user"') if current_user.blank?
    raise ArgumentError.new('Missing "feature"') if feature.blank?
    raise ArgumentError.new('Missing "permissions"') if permissions.blank?

    @current_user = current_user
    @feature = feature
    @permissions = permissions
  end

  def call
    if @current_user&.roles.blank?
      # Current user do not have any roles
      return false
    end

    roles = Common::Role.where(:_id.in => @current_user.roles)
    if roles.blank?
      # Roles cannot be found
      return false
    end

    permit = nil
    roles.each do |role|
      permit = role.permissions.detect { |p| p[:code] == @feature }
      break if permit
    end

    if permit.nil?
      # Required feature not assigned to any of the roles
      return false
    end

    # NOTE: Bitwise AND operation
    (permit[:value] & @permissions) == @permissions
  end
end

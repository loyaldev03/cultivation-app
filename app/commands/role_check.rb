class RoleCheck
  prepend SimpleCommand

  def initialize(current_user, feature)
    # READ = Permission 1
    # UPDATE = Permission 2
    # CREATE = Permission 4
    # DELETE = Permission 8

    # Note: feature is code number from Constants::APP_MOD_XXXXXXXXX

    # Exception if missing required params
    raise ArgumentError.new('Missing "current_user"') if current_user.blank?
    raise ArgumentError.new('Missing "feature"') if feature.blank?

    @current_user = current_user
    @feature = feature
  end

  def call
    if @current_user&.roles.blank?
      if Facility.count.zero? && @current_user.user_mode == 'admin'
        # During initial setup where no facility exists
        return {read: true, update: true, create: true, delete: true}
      end
      # Current user do not have any roles
      return {read: false, update: false, create: false, delete: false}
    end

    roles = Common::Role.where(:_id.in => @current_user.roles)
    if roles.blank?
      # Roles cannot be found
      return {read: false, update: false, create: false, delete: false}
    end

    permit = nil
    roles.each do |role|
      # Is Super Admin
      if role.built_in && role.name == Constants::SUPER_ADMIN
        return {read: true, update: true, create: true, delete: true}
      end

      permit = role.permissions.detect { |p| p[:code] == @feature }
      break if permit
    end

    if permit.nil?
      # Required feature not assigned to any of the roles
      return {read: false, update: false, create: false, delete: false}
    end

    # NOTE: Bitwise AND operation
    {
      read: (permit[:value] & CAN_READ) == CAN_READ,
      update: (permit[:value] & CAN_UPDATE) == CAN_UPDATE,
      create: (permit[:value] & CAN_CREATE) == CAN_CREATE,
      delete: (permit[:value] & CAN_DELETE) == CAN_DELETE,
    }
  end
end

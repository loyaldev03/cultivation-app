class QueryUsers
  prepend SimpleCommand

  def initialize(facility_id, args = {})
    @facility_id = facility_id.to_bson_id if facility_id
    @task_permission = args[:task_permission]
    @current_user = args[:user]
  end

  def call
    if valid?
      users = []
      if @task_permission
        if RoleCheck.call(@current_user, Constants::APP_MOD_ASSSIGN_TASKS_TO_ALL_USERS).result[:read] == true
          users = User.in(facilities: @facility_id).where(is_active: true).order_by(first_name: :asc).to_a
        elsif RoleCheck.call(@current_user, Constants::APP_MOD_ASSIGN_TASKS_ONLY_TO_MY_DIRECT_REPORTS).result[:read] == true
          users = User.in(facilities: @facility_id).where(is_active: true).where(reporting_manager_id: @current_user.id).order_by(first_name: :asc).to_a
        end
      else
        users = User.in(facilities: @facility_id).where(is_active: true).order_by(first_name: :asc).to_a
      end

      role_ids = users.pluck(:roles).flatten
      roles = Common::Role.where(:id.in => role_ids).to_a
      users.each do |u|
        u.roles = u.roles.map do |r|
          role = roles.detect { |x| x.id == r }
          if role
            {
              id: role.id.to_s,
              name: role.name,
            }
          else
            {}
          end
        end
      end
    end
  end

  private

  def valid?
    if @facility_id.nil?
      errors.add(:error, 'Unknown facility.')
      return false
    end
    true
  end
end

class QueryUsers
  prepend SimpleCommand

  def initialize(current_user)
    @current_user = current_user
  end

  def call
    if valid?
      users = User.where(is_active: true).to_a
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
    if @current_user.nil?
      errors.add(:error, 'Unknown current user.')
      return false
    end
    true
  end
end

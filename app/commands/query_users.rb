class QueryUsers
  prepend SimpleCommand

  def initialize(facility_id)
    @facility_id = facility_id.to_bson_id if facility_id
  end

  def call
    if valid?
      users = User.in(facilities: @facility_id).
        where(is_active: true).
        order_by(first_name: :asc).
        to_a
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

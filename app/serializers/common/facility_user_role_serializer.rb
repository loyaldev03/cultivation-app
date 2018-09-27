module Common
  class FacilityUserRoleSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name

    attribute :groups do |object|
      object.groups.map do |group|
        {
          id: group.id.to_s,
          name: group.name,
          facility_id: group.facility_id,
        }
      end
    end

    attribute :roles do |object|
      object.roles.map do |role|
        {
          id: role.id.to_s,
          name: role.name,
        }
      end
    end

    attribute :users do |object|
      object.users.map do |user|
        {
          id: user.id.to_s,
          first_name: user.first_name,
          last_name: user.last_name,
          title: user.title,
          email: user.email,
          roles: user.roles.map(&:to_s),
        }
      end
    end
  end
end

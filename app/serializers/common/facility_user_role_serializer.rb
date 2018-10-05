module Common
  class FacilityUserRoleSerializer
    include FastJsonapi::ObjectSerializer
    attribute :facilities do |object|
      object.facilities.map do |facility|
        {
          id: facility[:id].to_s,
          name: facility[:name],
          code: facility[:code],
        }
      end
    end

    attribute :roles do |object|
      object.roles.map do |role|
        {
          id: role.id.to_s,
          name: role.name,
          desc: role.desc,
        }
      end
    end
    
    attribute :modules

    attribute :users do |object|
      object.users.map do |user|
        default_facility_id = user.default_facility_id ? user.default_facility_id.to_s : nil
        {
          id: user.id.to_s,
          first_name: user.first_name,
          last_name: user.last_name,
          is_active: user.is_active,
          email: user.email,
          title: user.title,
          photo_data: user.photo_data,
          photo_url: user.photo_url,
          roles: user.roles.map(&:to_s),
          facilities: user.facilities.map(&:to_s),
          default_facility_id: default_facility_id,
          sign_in_count: user.sign_in_count,
          current_sign_in_ip: user.current_sign_in_ip,
          current_sign_in_at: user.current_sign_in_at,
          last_sign_in_at: user.last_sign_in_at,
          last_sign_in_ip: user.last_sign_in_ip,
        }
      end
    end
  end
end

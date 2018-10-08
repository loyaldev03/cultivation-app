module Common
  class FacilityUserSerializer
    include FastJsonapi::ObjectSerializer
    attributes :first_name,
               :last_name,
               :is_active,
               :title,
               :email

    attribute :default_facility_id do |object|
      object.default_facility_id.to_s
    end

    attribute :photo_url do |object|
      if object.photo_data && object.photo_data != 'null'
        object.photo_url
      else
        ''
      end
    end

    attribute :facilities do |object|
      object.facilities.map(&:to_s)
    end

    attribute :roles do |object|
      object.roles.map(&:to_s)
    end
  end
end

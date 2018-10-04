module Common
  class FacilityUserSerializer
    include FastJsonapi::ObjectSerializer
    attributes :first_name, :last_name, :is_active, :title, :email, :photo_url

    attribute :facilities do |object|
      object.facilities.map(&:to_s)
    end

    attribute :roles do |object|
      object.roles.map(&:to_s)
    end
  end
end

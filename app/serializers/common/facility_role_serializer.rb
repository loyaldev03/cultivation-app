module Common
  class FacilityRoleSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name, :desc, :permissions
  end
end

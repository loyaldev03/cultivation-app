module Common
  class FacilityRoleSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name, :desc
  end
end

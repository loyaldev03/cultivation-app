module Common
  class StrainSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name, :strain_type
  end
end

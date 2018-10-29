module Common
  class UomSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name, :unit, :desc, :is_base_unit, :base_unit, :conversion, :dimension
  end
end

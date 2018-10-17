class NutrientSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :category, :uom, :value
end

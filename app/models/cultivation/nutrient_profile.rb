module Cultivation
  class NutrientProfile #BatchRecipe
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    belongs_to :batch, class_name: 'Cultivation::Batch'
    # field :category, type: String   # e.g. Vegetative

    embeds_many :nutrients
  end

  class Nutrient
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String       # e.g. Nitrogen, Phosphorus
    field :category, type: String   # e.g. Vegetative
    field :value, type: String      # e.g. 10
    field :uom, type: String        # e.g. mg
  end
end

# UI
# https://marvelapp.com/44hbbhe/screen/48175853

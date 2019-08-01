module Cultivation
  class NutrientProfile #BatchRecipe
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    field :phase_name, type: String # e.g Clone, Flower
    field :name, type: String # e.g. Week1
    field :task_id, type: BSON::ObjectId # bind to task
    field :start_date, type: Time # task start and end_date
    field :end_date, type: Time
    field :light_hours, type: Float
    field :temperature_day, type: Float
    field :temperature_night, type: Float
    field :humidity_level, type: Float
    field :water_intake_value, type: Float
    field :water_intake_uom, type: String
    field :water_ph, type: Float
    field :water_frequency_value, type: Integer
    field :water_frequency_uom, type: String

    belongs_to :batch
    belongs_to :task, optional: true
    embeds_many :nutrients
  end

  class Nutrient
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    # field :name, type: String       # e.g. Nitrogen, Phosphorus
    field :product_id, type: BSON::ObjectId
    field :amount, type: String      # e.g. 10
    field :amount_uom, type: String        # e.g. mg
    field :ppm, type: String # display ppm product
    field :active_ingredients, type: String # display micronutrients in product
  end
end

# UI
# https://marvelapp.com/44hbbhe/screen/48175853
# https://www.figma.com/file/fQoy8C5edjgd0tgVu5lwiAE7/SecretSauce?node-id=0%3A1

# NEW NUTRIENT PROFILE

#CAN REMOVE ADD_NUTRIENT IF THIS DONE
# INPUT FROM THIS SCREEN INSTEAD

# CLONE
#   Week1
#     - light_hours
#     - temperature_day
#     - temperature_night
#     - humidity_level %
#     - water_intake_value
#     - water_intake_uom
#     - water_daily
#     - water_intake_ph
#     - nutrients (*multiple)

#     - active_ingredients (*multiple)
#       - product_id
# - amount_value
# - amount_uom
# - ppm

#   Week2
#   Week3

# VEG 1
#   Week2

# VEG 2

# tables

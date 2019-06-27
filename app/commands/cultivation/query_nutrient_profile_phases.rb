module Cultivation
  class QueryNutrientProfilePhases
    prepend SimpleCommand

    attr_reader :batch_id, :phases

    def initialize(batch_id)
      @batch_id = batch_id.to_bson_id
      # @phases = phases.split(',') if phases.present?
    end

    def call
      batch = Cultivation::Batch.find(@batch_id)
      tasks = Cultivation::QueryTasks.call(batch).result
      nutrient_profiles = batch.nutrient_profiles
      result = []
      if tasks
        selected_tasks = tasks.select { |a| a.indelible == 'add_nutrient' && a.indent == 2 }
        selected_tasks.each do |task|
          children = WbsTree.children(tasks, task.wbs)
          weeks = []
          children.each do |child|
            nutrient_profile = nutrient_profiles.detect { |a| a.phase_name == task.phase && a.name == child.name }
            if nutrient_profile.present?
              weeks << {
                name: child.name,
                nutrient_enabled: nutrient_profile.present?,
                light_hours: nutrient_profile.light_hours,
                temperature_day: nutrient_profile.temperature_day,
                temperature_night: nutrient_profile.temperature_night,
                humidity_level: nutrient_profile.humidity_level,
                water_intake_value: nutrient_profile.water_intake_value,
                water_intake_uom: nutrient_profile.water_intake_uom,
                water_frequency_value: nutrient_profile.water_frequency_value,
                water_frequency_uom: nutrient_profile.water_frequency_uom,
                water_ph: nutrient_profile.water_ph,
                dissolveNutrients: nutrient_profile.nutrients.map { |a|
                  product = a.product_id ? Inventory::Product.find(a.product_id) : nil
                  {
                    product_id: a.product_id.to_s,
                    product_name: product&.name,
                    product: {label: product&.name, value: product&.id.to_s, ppm: a.ppm},
                    amount: a.amount,
                    amount_uom: a.amount_uom,
                    ppm: a.ppm,
                    active_ingredients: a.active_ingredients,
                  }
                },
              }
            else
              weeks << {
                name: child.name,
                nutrient_enabled: nutrient_profile.present?,
              }
            end
          end
          result << {
            phase_name: task.phase,
            weeks: weeks,
          }
        end
        result
      end
    end
  end
end

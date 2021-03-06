module Cultivation
  class SaveNutrientProfile
    prepend SimpleCommand

    attr_reader :args

    def initialize(args = {})
      @args = args
    end

    def call
      save_record
    end

    private

    def save_record
      batch = Cultivation::Batch.find(args[:batch_id])
      task = batch.tasks.find_by(phase: args[:phase], name: args[:selectedWeek])
      record = batch.nutrient_profiles.find_or_create_by(phase_name: args[:phase], name: args[:selectedWeek])

      record.phase_name = args[:phase]
      record.name = args[:selectedWeek]
      record.task_id = task.id.to_s
      record.start_date = task.start_date
      record.end_date = task.end_date
      record.light_hours = args[:light_hours]
      record.temperature_day = args[:temperature_day]
      record.temperature_night = args[:temperature_night]
      record.humidity_level = args[:humidity_level]
      record.water_intake_value = args[:water_intake_value]
      record.water_intake_uom = args[:water_intake_uom]
      record.water_frequency_value = args[:water_frequency_value]
      record.water_frequency_uom = args[:water_frequency_uom]
      record.water_ph = args[:water_ph]

      record.nutrients = [] #clear and update new

      args['dissolveNutrients'].each do |a|
        record.nutrients.build(
          product_id: a['product_id'],
          amount: a['amount'],
          amount_uom: a['amount_uom'],
          ppm: a['ppm'],
          active_ingredients: a['active_ingredients'],
        )
      end

      record.save!

      {
        name: record.name,
        nutrient_enabled: true,
        light_hours: record.light_hours,
        temperature_day: record.temperature_day,
        temperature_night: record.temperature_night,
        humidity_level: record.humidity_level,
        water_intake_value: record.water_intake_value,
        water_intake_uom: record.water_intake_uom,
        water_frequency_value: record.water_frequency_value,
        water_frequency_uom: record.water_frequency_uom,
        water_ph: record.water_ph,
        dissolveNutrients: record.nutrients.map { |a|
          product = Inventory::Product.find(a.product_id)
          {
            product_id: a.product_id.to_s,
            product_name: product.name,
            product: {label: product.name, value: product.id.to_s, ppm: a.ppm},
            amount: a.amount,
            amount_uom: a.amount_uom,
            ppm: a.ppm,
            active_ingredients: a.active_ingredients,
          }
        },
      }
    rescue
      errors.add(:error, $!.message)
    end
  end
end

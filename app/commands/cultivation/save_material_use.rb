module Cultivation
  class SaveMaterialUse
    prepend SimpleCommand

    attr_reader :current_user, :id, :items, :nutrients

    def initialize(current_user, id, items, nutrients, water_ph)
      @current_user = current_user
      @id = id.to_bson_id
      @items = items
      @nutrients = nutrients
      @water_ph = water_ph
    end

    def call
      save_record
    end

    private

    def save_record
      record = Cultivation::Task.find(id)
      record.material_use = []
      record.add_nutrients = []
      record.water_ph = water_ph
      items.each do |item|
        record.material_use.build(
          product_id: item[:product_id],
          quantity: item[:quantity],
          uom: item[:uom],
        )
      end
      nutrients.each do |nutrient|
        value = nutrient[:value].present? ? nutrient[:value].to_f : 0.00
        record.add_nutrients.build(
          element: nutrient[:element],
          value: value,
        )
      end
      record.save!
      record
    rescue
      errors.add(:error, $!.message)
    end
  end
end

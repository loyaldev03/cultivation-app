module Cultivation
  class SaveMaterialUse
    prepend SimpleCommand

    attr_reader :current_user, :id, :items

    def initialize(current_user, id, items, water_ph)
      @current_user = current_user
      @id = id.to_bson_id
      @items = items
      @water_ph = water_ph
    end

    def call
      save_record
    end

    private

    def save_record
      record = Cultivation::Task.find(id)
      record.material_use = []
      record.water_ph = @water_ph
      items.each do |item|
        record.material_use.build(
          product_id: item[:product_id],
          quantity: item[:quantity],
          uom: item[:uom],
        )
      end
      record.save
      record
    rescue
      errors.add(:error, $!.message)
    end
  end
end

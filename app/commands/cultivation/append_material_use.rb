# Call this method instead of SaveMaterialUse if want to:
# 1. append new product to use

module Cultivation
  class AppendMaterialUse
    prepend SimpleCommand

    attr_reader :current_user, :id, :items

    def initialize(current_user, id, items)
      @current_user = current_user
      @id = id.to_bson_id
      @items = items
    end

    def call
      save_record
    end

    private

    def save_record
      record = Cultivation::Task.find(id)

      if !items.nil?
        items.each do |item|
          p_id = item[:product_id]
          uom = resolve_uom(item[:uom], item[:product_id])

          m = record.material_use.build(
            product_id: p_id,
            quantity: item[:quantity] || 0,
            uom: uom,
          )
          # Rails.logger.debug "\t\t\t>>>> m: #{m.inspect}"
        end
      end

      record.save!
      record
    end

    def resolve_uom(uom, product_id)
      if uom.blank?
        product = Inventory::Product.find(product_id)
        product.catalogue.common_uom
      else
        uom
      end
    end
  end
end

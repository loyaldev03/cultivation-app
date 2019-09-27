module Inventory
  class CreateProductSubCategory
    prepend SimpleCommand

    def initialize(args = {})
      raise ArgumentError.new('product_category_id is required') if args[:product_category_id].blank?
      raise ArgumentError.new('sub_category_name is required') if args[:sub_category_name].blank?

      @product_category_id = args[:product_category_id].to_bson_id
      @sub_category_name = args[:sub_category_name]
      @package_units = args[:package_units]
    end

    def call
      product_category = Inventory::ProductCategory.find_by(
        id: @product_category_id,
      )

      sub_category = product_category.sub_categories.build
      sub_category.name = @sub_category_name
      sub_category.package_units = []

      if !@package_units.blank?
        @package_units.each do |x|
          sub_category.package_units.build(
            value: x[:value],
            label: x[:label],
            uom: get_uom(x),
            quantity_in_uom: get_quantity_in_uom(x),
          )
        end
      end

      product_category.save!
      product_category
    end

    def get_uom(unit)
      if unit[:uom].present?
        return unit[:uom][:value]
      else
        wu = Constants::BUILTIN_WEIGHT_UNITS.find { |a| a[:label] == unit[:label] }
        return wu[:uom] if wu.present?
      end
    end

    def get_quantity_in_uom(unit)
      if unit[:quantity].present?
        return unit[:quantity]
      else
        wu = Constants::BUILTIN_WEIGHT_UNITS.find { |a| a[:label] == unit[:label] }
        return wu[:quantity_in_uom] if wu.present?
      end
    end
  end
end

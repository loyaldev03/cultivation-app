module Inventory
  class UpdateProductSubCategory
    prepend SimpleCommand

    def initialize(args = {})
      raise ArgumentError.new('sub_category_id is required') if args[:sub_category_id].blank?
      raise ArgumentError.new('sub_category_name is required') if args[:sub_category_name].blank?

      @sub_category_id = args[:sub_category_id].to_bson_id
      @sub_category_name = args[:sub_category_name]
      @package_units = args[:package_units]
    end

    def call
      product_category = Inventory::ProductCategory.find_by(
        "sub_categories._id": @sub_category_id,
      )

      sub_category = product_category.sub_categories.detect { |x| x.id == @sub_category_id }
      sub_category.name = @sub_category_name
      sub_category.package_units = []

      if !@package_units.blank?
        @package_units.each do |x|
          sub_category.package_units.build(
            value: x[:value],
            label: x[:label],
            uom: x[:uom].present? ? x[:uom][:value] : '',
            quantity_in_uom: x[:quantity].present? ? x[:quantity] : '',
          )
        end
      end

      product_category.save!
      product_category
    end
  end
end

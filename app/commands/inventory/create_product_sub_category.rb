module Inventory
  class CreateProductSubCategory
    prepend SimpleCommand

    def initialize(args = {})
      raise ArgumentError.new('product_category_id is required') if args[:product_category_id].blank?
      raise ArgumentError.new('sub_category_name is required') if args[:sub_category_name].blank?

      @product_category_id = args[:product_category_id].to_bson_id
      @sub_category_name = args[:sub_category_name]
    end

    def call
      product_category = Inventory::ProductCategory.find_by(
        id: @product_category_id,
      )

      sub_category = product_category.sub_categories.build
      sub_category.name = @sub_category_name

      product_category.save!
      product_category
    end
  end
end

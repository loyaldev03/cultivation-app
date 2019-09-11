module Inventory
  class DeleteProductSubCategory
    prepend SimpleCommand

    def initialize(sub_category_id)
      raise ArgumentError.new('sub_category_id is required') if sub_category_id.blank?

      @sub_category_id = sub_category_id.to_bson_id
    end

    def call
      product_category = Inventory::ProductCategory.find_by(
        "sub_categories._id": @sub_category_id,
      )
      sub_category = product_category.sub_categories.detect { |x| x.id == @sub_category_id }
      product_category.sub_categories = product_category.sub_categories - [sub_category]
      product_category.save!
      product_category
    end
  end
end

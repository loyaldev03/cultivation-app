module Inventory
  class QueryRawMaterial
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      arr = []
      catalogues = Inventory::Catalogue.where(catalogue_type: 'raw_materials')
      categories = catalogues.select { |a| a.category == '' and a.sub_category == '' }
      categories.each do |category|
        arr << category
        category_children = catalogues.select { |a| a.category == category.key and a.sub_category == '' }
        if category_children
          category_children.each do |c|
            arr << c
            c_children = catalogues.select { |a| a.category == category.key and a.sub_category == c.key }
            if c_children
              c_children.each do |a|
                arr << a
              end
            end
          end
        end
      end
      arr
    end
  end
end

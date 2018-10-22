# Item Catalogue is a catalogue that facility uses.
# It does nothing more than to help to minimise product option and to make
# it easier for user to use.
module Inventory
  class Catalogue
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :label, type: String
    field :key, type: String
    field :catalogue_type, type: String                  # { raw_materials, sales_product, non_sales_product }
    field :category, type: String, default: ''   # { nutrient, grow_light, supplements, grow_medium, others }
    field :sub_category, type: String, default: ''
    field :acccount_code, type: String
    field :is_active, type: Boolean, default: true

    belongs_to :facility

    scope :raw_materials, -> { where(catalogue_type: 'raw_materials') }
    scope :sales_product, -> { where(catalogue_type: 'grow_lights') }
    scope :non_sales_product, -> { where(catalogue_type: 'non_sales_product') }
    scope :active, -> { where(is_active: true) }

    def children
      if sub_category.blank?
        Inventory::Catalogue.where(
          catalogue_type: self.catalogue_type,
          category: self.category,
          sub_category: self.key,
        )
      elsif category.blank?
        Inventory::Catalogue.where(
          catalogue_type: self.catalogue_type,
          category: self.key,
          sub_category: '',
        )
      else
        []
      end
    end
  end
end

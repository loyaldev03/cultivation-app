# Item Catalogue is a catalogue that facility uses.
# It does nothing more than to help to minimise product option and to make it easier for user to use.
#
# Example to map this tree:
#     - Nutrients
#       - Potassium
#         - Seaweed
#
# Code:
# nutrients  = Inventory::Catalogue.create!(
#                     catalogue_type: 'raw_materials',
#                     key: 'nutrients',
#                     category: '',
#                     sub_category: '')
#
# potassium = Inventory::Catalogue.create!(
#                     catalogue_type: 'raw_materials',
#                     key: 'potassium',
#                     category: 'nutrients',
#                     sub_category: '')
#
# seaweed   = Inventory::Catalogue.create!(
#                     catalogue_type: 'raw_materials',
#                     key: 'seaweed',
#                     category: 'nutrients',
#                     sub_category: 'potassium')

module Inventory
  class Catalogue
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :label, type: String                           # For display purpose only.
    field :key, type: String
    field :catalogue_type, type: String                  # { raw_materials, sales_product, non_sales_product, plant }
    field :category, type: String, default: ''           # If node is level 1, refer to parent using parent's key. Posb. values: { nutrient, grow_light, supplements, grow_medium, others }
    field :sub_category, type: String, default: ''       # If node is level 2, refer to parant using parent's key.
    field :acccount_code, type: String
    field :is_active, type: Boolean, default: true
    field :uom_dimension, type: String

    belongs_to :facility

    scope :raw_materials, -> { where(catalogue_type: 'raw_materials') }
    scope :sales_product, -> { where(catalogue_type: 'sales_product') }
    scope :non_sales_product, -> { where(catalogue_type: 'non_sales_product') }
    scope :plants, -> { where(catalogue_type: 'plant') }
    scope :active, -> { where(is_active: true) }

    def uoms
      Common::UnitOfMeasure.where(dimension: self.uom_dimension)
    end

    def children
      if category.blank?
        Inventory::Catalogue.where(
          catalogue_type: self.catalogue_type,
          category: self.key,
          sub_category: '',
        )
      elsif sub_category.blank?
        Inventory::Catalogue.where(
          catalogue_type: self.catalogue_type,
          category: self.category,
          sub_category: self.key,
        )
      else
        []
      end
    end
  end
end

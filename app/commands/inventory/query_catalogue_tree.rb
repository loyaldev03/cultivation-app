###
# Calls the catalogue by selected facility, catalogue type & category
# If the catalogue has child items, it will return them as well as children.
# This is used for cascading selection.
#
module Inventory
  class QueryCatalogueTree
    prepend SimpleCommand
    attr_reader :facility_id, :type, :category

    def initialize(facility_id, type, category)
      @facility_id = facility_id
      @type = type
      @category = category
    end

    def call
      output = []
      catalogues = Inventory::Catalogue.where(catalogue_type: type, category: category, sub_category: '', facility_id: facility_id)
      catalogues.each do |parent|
        item = {
          label: parent.label,
          key: parent.key,
          id: parent.id.to_s,
        }

        if parent.uom_dimension.blank?
          children = parent.children.map do |child|
            {
              label: child.label,
              value: child.id.to_s,
              parent_key: parent.key,
              uoms: child.uoms.pluck(:unit),
            }
          end

          item.merge!(children: children)
        else
          item.merge!(uoms: parent.uoms.pluck(:unit), children: nil)
        end
        output << item
      end
      output
    end
  end
end

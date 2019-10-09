module Inventory
  class ProductCategory
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    # Product category is unique
    field :name, type: String

    # Weight based / Count based
    field :quantity_type, type: String

    # Indicate if this record is currently in use by other record.
    # This would decide if this record can be deleted.
    field :is_used, type: Boolean, default: -> { false }

    # Only active record would be available in the system.
    field :is_active, type: Boolean, default: -> { false }

    # In case record is in_used but user want to remove from the list, set this to
    # true and filter from api.
    field :deleted, type: Boolean, default: -> { false }

    # Which facilities uses this product category
    field :facilities, type: Array, default: [] # Array of BSON::ObjectId

    # METRC related
    # Mapping this category to METRC Item Category
    field :metrc_item_category, type: String

    validates :name, presence: true
    validates_uniqueness_of :name

    # Sub categories that belongs to this category
    embeds_many :sub_categories, class_name: 'Inventory::ProductSubCategory'
    embeds_many :package_units, class_name: 'Inventory::PackageUnit'
  end
end

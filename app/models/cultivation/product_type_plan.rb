module Cultivation
  # TODO: Rename to product work order
  class ProductTypePlan
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    belongs_to :batch, class_name: 'Cultivation::Batch'
    belongs_to :harvest_batch, class_name: 'Inventory::HarvestBatch'
    embeds_many :package_plans, class_name: 'Cultivation::PackagePlan'

    field :product_type, type: String
  end
end

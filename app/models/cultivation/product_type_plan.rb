module Cultivation
  class ProductTypePlan
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    belongs_to :batch, class_name: 'Cultivation::Batch'
    embeds_many :package_plans, class_name: 'Cultivation::PackagePlan'

    field :product_type, type: String
  end
end

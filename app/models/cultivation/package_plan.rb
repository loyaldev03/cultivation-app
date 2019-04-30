module Cultivation
  class PackagePlan
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    embedded_in :product_type_plan, class_name: 'Cultivation::ProductTypePlan'

    field :package_type, type: String
    field :quantity, type: Float
    field :uom, type: String
    field :total_weight, type: Float
  end
end
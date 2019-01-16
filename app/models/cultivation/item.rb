module Cultivation
  class Item
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :quantity, type: Float
    field :uom, type: String

    embedded_in :task, class_name: 'Cultivation::Task'
    belongs_to :catalogue, class_name: 'Inventory::Catalogue', optional: true
    belongs_to :product, class_name: 'Inventory::Product', optional: true
    # need facility strain field to cater for seed/ purchase clone to be used to start the batch
    #

    # def name
    #   catalogue.try(:label)
    # end
  end
end

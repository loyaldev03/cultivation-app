module Inventory
  class ItemArticle
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    belongs_to :item, class_name: 'Inventory::Item'
    belongs_to :facility
    belongs_to :strain, class_name: 'Common::Strain'       # redundant columns, not sure if need it
    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch', optional: true

    field :serial_no, type: String                        # aka Plant ID
    field :description, type: String
    field :location_id, type: BSON::ObjectId
    field :location_type, type: String
    field :status, type: String                           # available, consumed, disposed, damaged

    # Only for plants
    field :plant_status, type: String                     # indicate plant is curently mother / clone / veg / flower
                                                          # / shakes / leaves / buds
    field :planted_on, type: DateTime
    field :expected_harvested_on, type: DateTime
    field :mother_plant_id, type: BSON::ObjectId

    # To record drying
    field :wet_weight, type: BigDecimal
    field :dry_weight, type: BigDecimal
  end
end

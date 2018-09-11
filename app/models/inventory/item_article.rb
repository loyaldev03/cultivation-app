module Inventory
  class ItemArticle
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    belongs_to :item, class_name: 'Inventory::Item'
    belongs_to :facility
    belongs_to :strain, class_name: 'Common::Strain'      # redundant columns, not sure if need it
    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch', optional: true

    field :description, type: String
    field :location_id, type: BSON::ObjectId
    field :location_type, type: String

    field :serial_no, type: String                  # aka Plant ID
    field :sub_serial_no, type: String
    field :status, type: String                  # available, consumed, disposed, damaged, draft

    # Only for plants
    field :plant_status, type: String                  # indicate plant is curently mother / clone / veg / flower
                                                       # / shakes / leaves / buds
    field :planted_on, type: DateTime
    field :expected_harvested_on, type: DateTime
    field :mother_plant_id, type: BSON::ObjectId
    field :mother_plant, type: String                  # reserved for mother plant that may link or may not link to a plant record.
                                                       # mother_plant_id (BSON::ObjectId) will be empty when the plant is an old record
                                                       # and its mother has no record in store.

    # To record drying
    field :wet_weight, type: BigDecimal
    field :dry_weight, type: BigDecimal

    # For production batch
    field :production_batch, type: String
  end
end

# f1
#   = Plant AK47
#     - plant p001,     mother, nil,
#     - plant p004,     clone,  batch4,   p001
#     - plant p002,     veg,    batch3,   p001
#     - plant p003,     veg,    batch3,   p001
#       - plant p003.1, shakes, batch2,   p001
#       - plant p003.2, flower, batch2,   p001
#       - plant p003.3, leaves, batch2,   p001

#   = sales item AK47, sku: p0001
#     - package 1,

#   = Seed AK47
#   = Waste AK47

module Inventory
  class Plant
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    belongs_to :created_by, class_name: 'User'
    belongs_to :cultivation_batch, class_name: 'Cultivation::Batch'
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    # belongs_to :harvest_batch,      class_name: 'Cultivation::HarvestBatch',  optional: true
    # belongs_to :manicure_batch,     class_name: 'Cultivation::ManicureBatch', optional: true
    # has_many :item_histories

    field :plant_id, type: String
    field :plant_tag, type: String
    field :location_id, type: BSON::ObjectId
    field :location_type, type: String
    field :status, type: String
    field :current_growth_stage, type: String
    field :mother_date, type: DateTime
    field :planting_date, type: DateTime
    field :veg_date, type: DateTime
    field :veg1_date, type: DateTime
    field :veg2_date, type: DateTime
    field :flower_date, type: DateTime
    field :harvest_date, type: DateTime
    field :expected_harvest_date, type: DateTime
    field :expected_harvest_date, type: DateTime
    field :destroyed_date, type: DateTime

    field :origin_id, type: BSON::ObjectId
    field :origin_type, type: String
    field :wet_weight, type: BigDecimal
    field :wet_weight_unit, type: String

    field :purchase_info_id, type: BSON::ObjectId
    field :last_metrc_update, type: DateTime
  end
end

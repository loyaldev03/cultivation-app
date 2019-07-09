##
# This model tracks strain that is grown in one facility and also
# keeps record of data/ settings specific to this relationship eg.
# - THC & CBD over 2 years
# - Test arrangement
#
module Inventory
  class FacilityStrain
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :thc, type: Float, default: -> { 0 }
    field :cbd, type: Float, default: -> { 0 }
    field :strain_name, type: String
    field :strain_type, type: String

    field :indica_makeup, type: Integer
    field :sativa_makeup, type: Integer
    field :testing_status, type: String
    field :metrc_id, type: Integer

    belongs_to :facility, class_name: 'Facility'
    belongs_to :created_by, class_name: 'User'
    has_many :plants, class_name: 'Inventory::Plant'
  end
end

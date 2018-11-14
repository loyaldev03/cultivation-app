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

    field :thc, type: BigDecimal # FIXME: incorrect data type
    field :cbd, type: BigDecimal # FIXME: incorrect data type
    field :strain_name, type: String
    field :strain_type, type: String

    field :indica_makeup, type: Integer
    field :sativa_makeup, type: Integer
    field :testing_status, type: String

    belongs_to :facility, class_name: 'Facility'
    belongs_to :created_by, class_name: 'User'

    # has_many :cultivation_batches
    # has_many :harvest_batches
    # has_many :manicure_batches
    # has_many :manicure_batches
    # has_many :wastes
    # has_many :plants
    # has_many :destroyed_plants
  end
end

module Procurement
  class Manifest
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :manifest_no, type: String
    field :plant_stage, type: String
    field :plant_date, type: Time
  end
end

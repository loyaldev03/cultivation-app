module Common
  class Group
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :facility_id, type: BSON::ObjectId
  end
end

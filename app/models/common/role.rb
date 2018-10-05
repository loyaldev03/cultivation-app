module Common
  class Role
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
  end
end

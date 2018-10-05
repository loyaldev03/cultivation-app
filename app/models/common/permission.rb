module Common
  class Permission
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :desc, type: String
  end
end

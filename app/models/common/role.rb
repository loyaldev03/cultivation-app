module Common
  class Role
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :desc, type: String
    field :built_in, type: Boolean, default: -> { false }
    field :permissions, type: Array, default: []
  end
end

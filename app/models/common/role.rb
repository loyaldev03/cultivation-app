module Common
  class Role
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :desc, type: String
    field :permissions, type: Array, default: []

    def readonly?
      # Super Admin role cannot be altered
      super || self.name == Constants::SUPER_ADMIN
    end
  end
end

module Common
  class Role
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    has_many :members, class_name: 'User'
  end
end

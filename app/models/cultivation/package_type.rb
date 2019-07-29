module Cultivation
  class PackageType
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
  end
end

module Common
  class Strain
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :desc, type: String
    field :strain_type, type: String  # Hybrid, Indica, Sativa
  end
end

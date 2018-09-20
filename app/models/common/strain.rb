module Common
  class Strain
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :desc, type: String
    field :strain_type, type: String  # hybrid, indica, sativa

    has_many :batches, class_name: 'Cultivation::Batch'
  end
end

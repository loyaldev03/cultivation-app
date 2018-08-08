module Common

  class UnitOfMeasure
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :code, type: String
    field :desc, type: String

    # NOTE / TODO: Add conversion rules
    # field :base_uom, type: String
    # field :conversion, type: Number
  end
end
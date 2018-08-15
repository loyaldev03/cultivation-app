module Common
  class UnitOfMeasure
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :code, type: String
    field :desc, type: String
    field :base_unit, type: Boolean
    field :base_uom, type: String
    field :conversion, type: Integer

    scope :base_unit, -> { where(base_unit: true) }
    # NOTE / TODO: Add conversion rules
    # field :base_uom, type: String
    # field :conversion, type: Number

  end
end

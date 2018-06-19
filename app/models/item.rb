class Item
  include ActiveModel::Model

  field :name, type: String
  field :code, type: String # part no
  field :desc, type: String
  field :uom, type: String # unit of measure
end

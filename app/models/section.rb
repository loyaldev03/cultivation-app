class Section
  include Mongoid::Document

  field :name, type: String
  field :code, type: String
  field :desc, type: String
  field :purpose, type: String          # e.g. :storage, :cultivation, :other
  field :custom_purpose, type: String   # used when purpose = :other, e.g. 'general'
  field :storage_types, type: Array     # purpose = :storage, e.g. :consumable
  field :cultivation_types, type: Array # purpose = :cultivation, e.g. :mothering, :clone
  field :row_count, type: Integer       # for wizard, show only when is_complete = false
  field :shelf_count, type: Integer     # for wizard, show only when is_complete = false
  field :shelf_capacity, type: Integer  # for wizard, show only when is_complete = false
  field :is_complete, type: Boolean, default: -> { false }

  embedded_in :room
  embeds_many :rows
end

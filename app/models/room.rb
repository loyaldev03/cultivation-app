class Room
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :code, type: String
  field :full_code, type: String
  field :desc, type: String
  field :purpose, type: String
  field :has_sections, type: Boolean, default: -> { false }
  field :is_complete, type: Boolean, default: -> { false }
  # indicate record was generated by wizard
  # set to false after user saved
  field :wz_generated, type: Boolean, default: -> { true }
  field :metrc_id, type: Integer

  embedded_in :facility, class_name: 'Facility'
  embeds_many :rows, class_name: 'Row'
  embeds_many :sections, class_name: 'Section'
end

class Facility
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :code, type: String
  field :site_license, type: String
  field :timezone, type: String
  field :is_complete, type: Boolean, default: -> { false }
  field :is_enabled, type: Boolean, default: -> { true }

  embeds_one :address, as: :addressable, class_name: 'Address'
  embeds_many :rooms, class_name: 'Room'

  has_many :strains, class_name: 'Inventory::FacilityStrain'
  has_many :catalogue, class_name: 'Inventory::Catalogue'

  scope :completed, -> { where(is_complete: true) }

  def purposes
    # Consolidate all purposes of rooms & sections - This is used in Batch Setup to check if specific
    # phase / purpose room is available in the facility
    self.rooms.map { |r| r.sections.any? ? r.sections.pluck(:purpose) : r.purpose }.flatten.compact
  end

  def growth_stages
    # Based on whether there's Veg / Veg1 + Veg2 rooms, set the Cultivation Phases
    if purposes.include?(Constants::CONST_VEG1) && purposes.include?(Constants::CONST_VEG2)
      Constants::CULTIVATION_PHASES_2V
    else
      Constants::CULTIVATION_PHASES_1V
    end
  end
end

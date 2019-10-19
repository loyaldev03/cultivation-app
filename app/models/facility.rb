class Facility
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :code, type: String
  field :site_license, type: String
  field :license_type, type: String
  field :license_start, type: String
  field :license_end, type: String
  field :timezone, type: String, default: 'Pacific Time (US & Canada)'
  field :is_complete, type: Boolean, default: -> { false }
  field :is_enabled, type: Boolean, default: -> { true }
  field :square_foot, type: Float

  field :whitelist_ips, type: Array, default: []

  embeds_one :address, as: :addressable, class_name: 'Address'
  embeds_many :rooms, class_name: 'Room'
  embeds_many :preferences, class_name: 'Preference'

  has_many :strains, class_name: 'Inventory::FacilityStrain'
  has_many :plants, class_name: 'Inventory::FacilityStrain'
  has_many :items, class_name: 'Inventory::Item'
  has_many :catalogue, class_name: 'Inventory::Catalogue'
  has_many :metrc_tags, class_name: 'Inventory::MetrcTag'
  has_many :metrc_histories, class_name: 'MetrcHistory'

  scope :completed, -> { where(is_complete: true) }

  def purposes
    # Consolidate all purposes of rooms & sections - This is used in Batch Setup to check if specific
    # phase / purpose room is available in the facility
    rooms.map { |r| r.sections.any? ? r.sections.pluck(:purpose) : r.purpose }.flatten.compact
  end

  def growth_stages
    # Based on whether there's Veg / Veg1 + Veg2 rooms, set the Cultivation Phases
    if purposes.include?(Constants::CONST_VEG1) && purposes.include?(Constants::CONST_VEG2)
      Constants::CULTIVATION_PHASES_2V
    else
      Constants::CULTIVATION_PHASES_1V
    end
  end

  def growth_stages_by_settings
    growth_stages.select { |a| purposes.include? a }
    # we assume purposes rooms created by the purpose in setting page
    # take Constants::CULTIVATION_PHASES_2V and find which is exist in purposes
  end

  def onboarding_val(code)
    preferences.find_by(code: code)&.value
  end

  def update_onboarding(code)
    preferences.find_by(code: code).update(value: true)
    unless preferences.pluck(:value).include?(false)
      if onboarding_val('ONBOARDING_DONE') == false
        preferences.find_by(code: 'ONBOARDING_DONE').update(value: true)
      end
    end
  end
end

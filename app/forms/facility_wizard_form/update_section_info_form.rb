module FacilityWizardForm
  class UpdateSectionInfoForm
    include ActiveModel::Model
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :id,
             :name,
             :code,
             :purpose,
             :purpose_option]

    attr_accessor(*ATTRS)

    validates :code, presence: true

    def submit(params)
      self.map_attrs_from_hash(ATTRS, params)
      if valid?
        save_cmd = SaveSection.call(self)
      else
        false
      end
    end
  end
end

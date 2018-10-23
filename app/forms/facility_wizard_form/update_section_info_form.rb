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
             :purpose_option,
             :rack_has_levels,
             :rack_count]

    attr_accessor(*ATTRS)

    validates :code, presence: true

    def submit(params, current_user)
      raise ArgumentError, 'Missing current_user' if current_user.nil?

      self.map_attrs_from_hash(ATTRS, params)
      if valid?
        save_cmd = SaveSection.call(self)
      else
        false
      end
    end
  end
end

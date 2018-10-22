module FacilityWizardForm
  class UpdateRoomInfoForm
    include ActiveModel::Model
    include Mapper

    ATTRS = [:facility_id,
             :id,
             :name,
             :code,
             :desc,
             :purpose,
             :has_sections]

    attr_accessor(*ATTRS)

    validates :name, presence: true
    validates :code, presence: true

    def submit(params, current_user)
      raise ArgumentError, 'Missing current_user' if current_user.nil?

      self.map_attrs_from_hash(ATTRS, params)
      if valid?
        save_cmd = SaveRoom.call(self)
      end
    end
  end
end

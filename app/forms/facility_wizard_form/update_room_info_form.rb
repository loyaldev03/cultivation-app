module FacilityWizardForm
  class UpdateRoomInfoForm
    include ActiveModel::Model
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

    def submit(params)
      map_attrs_from_request(params)
      if valid?
        save_cmd = SaveRoom.call(self)
      end
    end

    private

    def map_attrs_from_request(params)
      ATTRS.each do |key|
        self.send("#{key}=", params[key])
      end
    end
  end
end

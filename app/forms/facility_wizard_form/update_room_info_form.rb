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

    def submit(facility_id, room_id, params)
      map_attrs_from_request(facility_id, room_id, params)
      if valid?
        save_cmd = SaveRoom.call(self)
      end
    end

    private

    def map_attrs_from_request(facility_id, room_id, params)
      self.facility_id = facility_id
      self.id = room_id
      self.name = params[:name]
      self.code = params[:code]
      self.desc = params[:desc]
      self.purpose = params[:purpose]
      self.has_sections = params[:has_sections]
    end
  end
end

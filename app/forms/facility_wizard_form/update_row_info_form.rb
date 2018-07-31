module FacilityWizardForm
  class UpdateRowInfoForm
    include ActiveModel::Model
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :id,
             :name,
             :code,
             :has_shelves,
             :has_trays,
             :wz_shelves_count,
             :wz_trays_count]

    attr_accessor(*ATTRS)

    validates :facility_id, presence: true
    validates :room_id, presence: true
    validates :id, presence: true
    validates :name, presence: true
    validates :code, presence: true

    def submit(params)
      self.map_attrs_from_hash(ATTRS, params)
      if valid?
        save_cmd = SaveRow.call(self)
      end
    end
  end
end

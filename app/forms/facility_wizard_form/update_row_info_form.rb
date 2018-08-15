module FacilityWizardForm
  class UpdateRowInfoForm
    include ActiveModel::Model
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :id, # row.id
             :name,
             :code,
             :has_shelves,
             :has_trays,
             :wz_shelves_count,
             :wz_trays_count]

    attr_accessor(*ATTRS)
    attr_reader :is_continue, :result

    validates :facility_id, presence: true
    validates :room_id, presence: true
    validates :id, presence: true
    validates :name, presence: true
    validates :code, presence: true

    def initialize(is_continue)
      @is_continue = is_continue
    end

    def submit(params)
      self.map_attrs_from_hash(ATTRS, params)
      if valid?
        save_cmd = SaveRow.call(self)
        @result = save_cmd.result
        if save_cmd.success? && @is_continue
          # NOTE: Save the row for the first time
          # This will also generate the shelves & trays
          SaveRowShelvesTrays.call(self)
        end
        return save_cmd.success?
      end
    end
  end
end

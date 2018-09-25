module FacilityWizardForm
  class UpdateShelfTraysForm
    include ActiveModel::Model
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :row_id,
             :id,   # shelf.id
             :code, # shelf.code
             :trays]

    attr_accessor(*ATTRS)
    attr_accessor :duplicate_target

    validates :code, presence: true

    def submit(params)
      @facility_id = params[:facility_id]
      @room_id = params[:room_id]
      @row_id = params[:row_id]
      @id = params[:id]
      @code = params[:code]
      @trays = map_trays_from_params(params[:trays])

      if valid?
        cmd = SaveShelf.call(params)
        @trays.each do |tray|
          SaveTray.call(cmd.result, tray)
        end
      else
        false
      end
    end

    private

    def map_trays_from_params(p_trays)
      if p_trays.blank?
        []
      else
        p_trays.map do |tray|
          UpdateTrayInfoForm.new(tray)
        end
      end
    end
  end
end

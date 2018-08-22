module FacilityWizardForm
  class RowShelvesTraysForm
    ATTRS = [:facility_id,
             :room_id,
             :id, # row.id
             :shelf_id,
             :shelf_code,
             :is_use_trays,
             :shelves,
             :trays]

    attr_accessor(*ATTRS)
    attr_accessor :is_last_shelf, :show_duplicate_dialog

    def initialize(facility_id, room_id, row_id, shelf_id = nil)
      @facility_id = facility_id
      @room_id = room_id
      @id = row_id
      @shelf_id = shelf_id
      set_record
    end

    def current_shelf_index
      curr_index = @shelves.find_index { |x| x.id == @shelf_id.to_bson_id } unless @shelf_id.nil?
    end

    def set_next_shelf(curr_index)
      next_index = curr_index + 1
      shelf = next_index >= @shelves.size ? @shelves&.last : @shelves[next_index]
      @shelf_id = shelf.id
      @shelf_code = shelf.code
      @trays = get_trays
    end

    def is_last_shelf
      @shelves&.last&.id == @shelf_id
    end

    private

    def set_record
      facility = Facility.find(@facility_id)
      room = facility.rooms.find(@room_id)
      row = room.rows.find(@id)
      if row.shelves.blank?
        @shelves = []
      else
        @shelves = row.shelves.map do |shelf|
          ShelfInfoForm.new(@facility_id, @room_id, @id, shelf)
        end
      end

      if @shelf_id.nil?
        # if no shelf_id provided, return trays for first shelf
        first_shelf = @shelves&.first
      elsif @shelf_id == -1
        first_shelf = @shelves&.last
      else
        first_shelf = row.shelves.find(@shelf_id)
      end

      @shelf_id = first_shelf&.id
      @shelf_code = first_shelf&.code
      @trays = get_trays
    end

    def get_trays
      tray_models = Tray.where(shelf_id: @shelf_id)
      @trays = tray_models.map do |tray|
        TrayInfoForm.new(@facility_id, @room_id, @id, @shelf_id, tray)
      end
    end
  end
end

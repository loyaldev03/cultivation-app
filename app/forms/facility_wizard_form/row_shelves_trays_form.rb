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

    def initialize(facility_id, room_id, row_id, shelf_id = nil)
      @facility_id = facility_id
      @room_id = room_id
      @id = row_id
      @shelf_id = shelf_id
      set_record
    end

    def current_shelf_index
      Rails.logger.debug ">>> current_shelf_index <<<"
      unless @shelf_id.nil?
        curr_index = @shelves.find_index { |x| x.id == @shelf_id.to_bson_id }
        Rails.logger.debug ">>> j curr_index <<< #{curr_index}"
        Rails.logger.debug ">>> k @shelves.size <<< #{@shelves.size}"
        if curr_index <= @shelves.size
          curr_index
        else
          -1
        end
      end
    end

    def set_shelf_by_index(shelf_index)
      if shelf_index == -1
        shelf = @shelves&.last
      else
        shelf = @shelves[shelf_index]
      end
      @shelf_id = shelf.id
      @shelf_code = shelf.code
      @trays = get_trays
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

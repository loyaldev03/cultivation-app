class SaveRowByDuplicating
  prepend SimpleCommand
  include Mapper

  def initialize(facility_id, room_id, source_row_id, target_rows_id)
    @facility_id = facility_id
    @room_id = room_id
    @source_row_id = source_row_id
    @target_rows_id = target_rows_id
  end

  def call
    duplicate_rows
  end

  private

  COPY_ROWS_ATTRS = [:is_complete,
                     :has_shelves,
                     :has_trays,
                     :wz_generated,
                     :wz_shelves_count,
                     :wz_trays_count]

  COPY_SHELF_ATTRS = [:capacity,
                      :wz_generated,
                      :is_complete,
                      :is_use_trays]

  COPY_TRAY_ATTRS = [:capacity,
                     :capacity_type,
                     :wz_generated]

  def duplicate_rows
    unless @target_rows_id.blank?
      source_row = room.rows.detect { |o| o.id == @source_row_id.to_bson_id }

      @target_rows_id.each do |target_row_id|
        target_row = room.rows.detect { |o| o.id == target_row_id.to_bson_id }
        # copy row fields
        copy_attrs(COPY_ROWS_ATTRS, source_row, target_row)

        # copy shelves fields
        source_row.shelves.each_with_index do |source_shelf, index|
          if target_row.shelves.blank? || target_row.shelves.size < index + 1
            # Only build new shelves if there are more shelves in source row
            target_shelf = target_row.shelves.build
          else
            # Reuse existing shelf in target
            target_shelf = target_row.shelves[index]
          end
          copy_attrs(COPY_SHELF_ATTRS, source_shelf, target_shelf)
          target_shelf.code = NextFacilityCode.call(:shelf, nil, index + 1).result
          target_shelf.full_code = Constants.generate_full_code(facility, room, target_row, target_shelf)
          # copy trays fields
          trays_id = []
          copy_trays(target_row, source_shelf.trays, target_shelf, trays_id)
          target_shelf.trays.not_in(:_id => trays_id).delete_all
        end
        target_row.is_complete = source_row.is_complete
        target_row.save!
      end
      # Update Room is_complete flag
      SaveRoomIsComplete.call_by_id(@facility_id, @room_id)
      source_row
    end
  end

  def facility
    @facility ||= Facility.find(@facility_id)
  end

  def room
    @room ||= facility.rooms.detect { |r| r.id == @room_id.to_bson_id }
  end

  def copy_trays(target_row, source_trays, target_shelf, trays_id)
    source_trays.each_with_index do |source_tray, index|
      target_tray = target_shelf.trays.find_by(code: source_tray.code) || Tray.new
      copy_attrs(COPY_TRAY_ATTRS, source_tray, target_tray)
      target_tray.shelf = target_shelf
      target_tray.code = NextFacilityCode.call(:tray, nil, index + 1).result
      target_tray.full_code = Constants.generate_full_code(facility, room, target_row, target_shelf, target_tray)
      target_tray.save!
      trays_id.push(target_tray.id)
    end
  end
end

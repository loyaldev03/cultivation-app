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
                      :is_use_trays]

  COPY_TRAY_ATTRS = [:capacity,
                     :capacity_type,
                     :wz_generated]

  def duplicate_rows
    Rails.logger.debug ">>> duplicate_rows 1"
    unless @target_rows_id.blank?
      Rails.logger.debug ">>> duplicate_rows 2"
      facility = Facility.find(@facility_id)
      room = facility.rooms.detect { |r| r.id == @room_id.to_bson_id }
      source_row = room.rows.detect { |o| o.id == @source_row_id.to_bson_id }
      Rails.logger.debug ">>> duplicate_rows 3"

      @target_rows_id.each do |target_row_id|
        Rails.logger.debug ">>> duplicate_rows - loop target ids #{target_row_id}"
        target_row = room.rows.detect { |o| o.id == target_row_id.to_bson_id }
        
        Rails.logger.debug ">>> duplicate_rows - 4" 
        # copy row fields
        copy_attrs(COPY_ROWS_ATTRS, source_row, target_row)

        Rails.logger.debug ">>> duplicate_rows - 5" 
        # copy shelves fields
        source_row.shelves.each_with_index do |source_shelf, index|
          Rails.logger.debug ">>> duplicate_rows - 6"
          if target_row.shelves.blank? || target_row.shelves.size < index + 1
            # Only build new shelves if there are more shelves in source row
            target_shelf = target_row.shelves.build
          else
            # Reuse existing shelf in target
            target_shelf = target_row.shelves[index]
          end
          Rails.logger.debug ">>> duplicate_rows - 7"
          copy_attrs(COPY_SHELF_ATTRS, source_shelf, target_shelf)
          Rails.logger.debug ">>> duplicate_rows - 8"
          target_shelf.code = NextFacilityCode.call(:shelf, nil, index + 1).result
          Rails.logger.debug ">>> duplicate_rows - 9"
          # copy trays fields
          copy_trays(source_shelf.trays, target_shelf)
          Rails.logger.debug ">>> duplicate_rows - 10"
        end
        target_row.save!
      end
    end
  end

  def copy_trays(source_trays, target_shelf)
    Rails.logger.debug ">>> duplicate_rows - 9.1"
    source_trays.each_with_index do |source_tray, index|
      Rails.logger.debug ">>> duplicate_rows - 9.2"
      target_tray = Tray.new
      Rails.logger.debug ">>> duplicate_rows - 9.3"
      copy_attrs(COPY_TRAY_ATTRS, source_tray, target_tray)
      Rails.logger.debug ">>> duplicate_rows - 9.4"
      target_tray.shelf = target_shelf
      Rails.logger.debug ">>> duplicate_rows - 9.5"
      target_tray.code = NextFacilityCode.call(:tray, nil, index + 1).result
      Rails.logger.debug ">>> duplicate_rows - 9.6"
      target_tray.save!
    end
  end
end

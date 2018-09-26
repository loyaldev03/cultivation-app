class SaveShelvesByDuplicating
  prepend SimpleCommand
  include Mapper

  def initialize(facility_id, room_id, row_id, source_shelf_id, duplicate_target)
    @facility_id = facility_id
    @room_id = room_id
    @row_id = row_id
    @source_shelf_id = source_shelf_id
    @duplicate_target = duplicate_target
  end

  def call
    duplicate_shelves
  end

  private

  COPY_SHELF_ATTRS = [:capacity,
                      :wz_generated,
                      :is_complete,
                      :is_use_trays]

  COPY_TRAY_ATTRS = [:capacity,
                     :capacity_type,
                     :wz_generated]

  def duplicate_shelves
    unless @duplicate_target.blank?
      facility = Facility.find(@facility_id)
      room = facility.rooms.detect { |r| r.id == @room_id.to_bson_id }
      row = room.rows.detect { |o| o.id == @row_id.to_bson_id }
      source_shelf = row.shelves.detect { |o| o.id == @source_shelf_id.to_bson_id }

      if @duplicate_target == 'all'
        row.shelves.each do |target_shelf|
          if target_shelf.id != source_shelf.id
            copy_attrs(COPY_SHELF_ATTRS, source_shelf, target_shelf)
            copy_trays(source_shelf.trays, target_shelf)
          end
        end
      else
        target_shelf = row.shelves.detect { |o| o.id == @duplicate_target.to_bson_id }
        if target_shelf.present?
          copy_attrs(COPY_SHELF_ATTRS, source_shelf, target_shelf)
          copy_trays(source_shelf.trays, target_shelf)
        end
      end

      # Update Row is_complete flag
      SaveRowIsComplete.call(row)
      # Update Room is_complete flag
      SaveRoomIsComplete.call_by_id(@facility_id, @room_id)
      row
    end
  end

  def copy_trays(source_trays, target_shelf)
    target_trays = target_shelf.trays || []
    if source_trays.any?
      source_trays.each_with_index do |source_tray, index|
        target_tray = target_trays[index] || Tray.new({code: NextFacilityCode.call(:tray, nil, index + 1).result})
        copy_attrs(COPY_TRAY_ATTRS, source_tray, target_tray)
        target_tray.shelf = target_shelf
        target_tray.save!
      end
    end
  end
end

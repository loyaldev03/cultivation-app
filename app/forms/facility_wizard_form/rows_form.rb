module FacilityWizardForm
  class RowsForm
    include Mapper

    ATTRS = [:facility_id,
             :room_id,
             :wz_rows_count,
             :rows]

    attr_accessor(*ATTRS)

    def initialize(facility_id, room_id)
      @facility_id = facility_id
      @room_id = room_id
      set_record(facility_id, room_id)
    end

    def generate_rows(rows_count = 0)
      @wz_rows_count = rows_count
      if @rows.blank?
        @rows = Array.new(rows_count) do |i|
          RowInfoForm.new(@facility_id, @room_id, {
            id: BSON::ObjectId.new,
            code: "Rw#{i + 1}", # TODO: Use sequence generator
            name: "Row #{i + 1}",
          })
        end
      else
        if rows_count <= @rows.size
          @rows = @rows.first(rows_count)
          # Rails.logger.debug ">>>> 1: rows_count => #{rows_count}"
        else
          missing_count = rows_count - @rows.size
          # Rails.logger.debug ">>>> 2: missing_count => #{missing_count}"
          last_code = @rows.last&.code
          # Rails.logger.debug ">>>> 3: last_code => #{last_code}"
          missing_rows = Array.new(missing_count) do |i|
            next_count = i + 1
            # Rails.logger.debug ">>>> 5: next_count => #{next_count}"
            row_code = NextFacilityCode.call(:row, last_code, next_count).result
            # Rails.logger.debug ">>>> 6: row_code => #{row_code}"
            row_name = "Row #{@rows.size + next_count}"
            # Rails.logger.debug ">>>> 7: row_name => #{row_name}"
            RowInfoForm.new(@facility_id, @room_id, {
              id: BSON::ObjectId.new,
              code: row_code,
              name: row_name
            })
          end
          @rows.concat(missing_rows)
          # Rails.logger.debug ">>>> 8: rows after generate => #{@rows.size}"
          # Rails.logger.debug ">>>> 8: rows after generate => #{@rows.to_s}"
        end
      end
    end

    private

    def set_record(facility_id, room_id)
      raise ArgumentError, 'Invalid Facility' if facility_id.nil?
      raise ArgumentError, 'Invalid Room' if room_id.nil?
      find_cmd = FindFacility.call({id: facility_id})
      if find_cmd.success?
        facility = find_cmd.result
        room = facility.rooms.detect { |r| r.id.to_s == room_id }
        # Rails.logger.debug ">>>> 001: room.name => #{room.name}"
        # Rails.logger.debug ">>>> 002: room.rows => #{room.rows}"
        raise ArgumentError, 'Invalid Room' if room.nil?

        if room.rows.blank?
          @wz_rows_count = []
          @rows = []
        else
          @wz_rows_count = room.rows.blank? ? 0 : room.rows.size
          @rows = room.rows.map do |row|
            RowInfoForm.new(facility.id, room.id, row)
          end
        end
        # Rails.logger.debug ">>>> 002: db.room. @rows.size => #{@rows.size}"
      end
    end
  end
end
module Inventory
  class SearchPlantsByLocation
    prepend SimpleCommand

    attr_reader :facility_id, :location_id, :location_type

    def initialize(facility_id, location_id)
      @facility_id = facility_id&.to_bson_id
      @location_id = location_id&.to_bson_id
    end

    def call
      if valid_params?
        # find all trays id by location type & id
        trays = query_trays
        # find all plants in all tray ids
        # return data
      end
    end

    private

    def locations
      @locations ||= QueryLocations.call(facility_id).result
    end

    def query_trays
      if @location_type.nil?
        res = locations.select { |x| x[:room_id] == location_id }
        if res.any?
          @location_type = "Room"
          return res
        end

        res = locations.select { |x| x[:section_id] == location_id }
        if res.any?
          @location_type = "Section"
          return res
        end

        res = locations.select { |x| x[:row_id] == location_id }
        if res.any?
          @location_type = "Row"
          return res
        end

        res = locations.select { |x| x[:shelf_id] == location_id }
        if res.any?
          @location_type = "Shelf"
          return res
        end

        res = locations.select { |x| x[:tray] == location_id }
        if res.any?
          @location_type = "Tray"
          return res
        end
      end
    end

    def valid_params?
      if facility_id.nil?
        errors.add(:facility_id, 'facility_id is required')
      end
      if location_id.nil?
        errors.add(:location_id, 'location_id is required')
      end
      errors.empty?
    end
  end
end

module Inventory
  SearchPlantByLocationResult = Struct.new(:plant_id,
                                           :plant_code,
                                           :location_id,
                                           :location_code)

  class SearchPlantsByLocation
    prepend SimpleCommand

    attr_reader :facility_id, :strain_id, :location_id, :location_type

    def initialize(facility_id, strain_id, location_id)
      @facility_id = facility_id&.to_bson_id
      @strain_id = strain_id&.to_bson_id
      @location_id = location_id&.to_bson_id
    end

    def call
      if valid_params?
        # find all trays id by location type & id
        trays = query_trays
        room_ids = trays.pluck(:room_id)
        section_ids = trays.pluck(:section_id)
        row_ids = trays.pluck(:row_id)
        shelf_ids = trays.pluck(:shelf_id)
        tray_ids = trays.pluck(:tray_id)
        all_ids = room_ids + section_ids + row_ids + shelf_ids + tray_ids
        # find all plants in all posible location id
        plants = Inventory::Plant.
          in(location_id: all_ids.compact.uniq).
          where(facility_strain_id: strain_id)
        plants.map do |p|
          SearchPlantByLocationResult.new(p.id.to_s,
                                          p.plant_id,
                                          p.location_id.to_s,
                                          get_location_code(p.location_id))
        end
      end
    end

    private

    def locations
      @locations ||= QueryLocations.call(facility_id).result
    end

    # TODO::REFACTOR#001 - Can this be refactor?
    def query_trays
      res = locations.select { |x| x[:room_id] == location_id }
      if res.any?
        @location_type = 'Room'
        return res
      end

      res = locations.select { |x| x[:section_id] == location_id }
      if res.any?
        @location_type = 'Section'
        return res
      end

      res = locations.select { |x| x[:row_id] == location_id }
      if res.any?
        @location_type = 'Row'
        return res
      end

      res = locations.select { |x| x[:shelf_id] == location_id }
      if res.any?
        @location_type = 'Shelf'
        return res
      end

      res = locations.select { |x| x[:tray] == location_id }
      if res.any?
        @location_type = 'Tray'
        return res
      end
    end

    # TODO::REFACTOR#001
    def get_location_code(location_id)
      res = locations.detect { |x| x[:room_id] == location_id }
      if res.present?
        return res[:room_full_code]
      end

      res = locations.detect { |x| x[:section_id] == location_id }
      if res.present?
        return res[:section_full_code]
      end

      res = locations.detect { |x| x[:row_id] == location_id }
      if res.present?
        return res[:row_full_code]
      end

      res = locations.detect { |x| x[:shelf_id] == location_id }
      if res.present?
        return res[:shelf_full_code]
      end

      res = locations.detect { |x| x[:tray] == location_id }
      if res.present?
        return res[:tray_full_code]
      end
    end

    def valid_params?
      if facility_id.nil?
        errors.add(:facility_id, 'facility_id is required')
      end
      if strain_id.nil?
        errors.add(:strain_id, 'strain_id is required')
      end
      if location_id.nil?
        errors.add(:location_id, 'location_id is required')
      end
      errors.empty?
    end
  end
end

module Charts
  class RoomDetail
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id]
      @purpose = @args[:purpose]
      @name = @args[:name]
      @full_code = @args[:full_code]
    end

    def call
      facility_rooms = QueryFacilitySummary.call(facility_id: @facility_id).result.select { |room| room[:purpose] == @purpose }
      room = facility_rooms.detect { |r| r[:room_name] == @name and r[:room_code] == @full_code }
      room_record = Facility.find(@facility_id).rooms.find_by(name: @name, code: @full_code)
      active_plant = find_active_plant(room_record)
      batch_info = find_batch_info(active_plant[:plants])
      group_strain = find_group_strain(active_plant[:plants])
      Rails.logger.debug "Group strain ==> #{active_plant[:count]}"
      if room.present?
        room.store(:active_plants, active_plant[:count])
        room.store(:room_temperature, batch_info[:room_temperature])
        room.store(:humidity, batch_info[:humidity])
        room.store(:light_hours, batch_info[:light_hours])
        room.store(:strain_distribution, group_strain)
        room
      else
        {
          room_name: '',
          room_code: '',
          purpose: '',
          room_has_sections: false,
          total_capacity: 0,
          planned_capacity: 0,
          available_capacity: 0,
          section_count: 0,
          row_count: 0,
          shelf_count: 0,
          tray_count: 0,
          active_plants: 0,
          room_temperature: 0,
          humidity: 0,
          light_hours: 0,
          strain_distribution: [],
        }
      end
    end

    def find_active_plant(room)
      if room.present?
        room_plant = Inventory::Plant.where(location_type: 'room', location_id: room[:id].to_s)
        rows_plant = Inventory::Plant.where(location_type: 'row', location_id: room.rows&.map { |a| a.to_s })
        shelves_plant = Inventory::Plant.where(location_type: 'row', location_id: room.rows&.map { |a| a.shelves.map { |b| b.id.to_s } }&.flatten)
        plants = room_plant + rows_plant + shelves_plant
        count = room_plant&.count + rows_plant&.count + shelves_plant&.count
        {count: count, plants: plants}
      else
        {count: 0, plants: []}
      end
    end

    def find_batch_info(plants)
      if plants.present?
        plant = plants.last
        batch = plant.cultivation_batch
        date = Time.current.beginning_of_day
        nutrient_profile = batch.nutrient_profiles.where(phase_name: batch.current_growth_stage).and(:start_date.lte => date, :end_date.gte => date).first rescue nil
        if nutrient_profile.present?
          {
            room_temperature: Time.current.hour > 19 ? nutrient_profile.temperature_night : nutrient_profile.temperature_day,
            humidity: nutrient_profile.humidity_level,
            light_hours: nutrient_profile.light_hours,
          }
        else
          {
            room_temperature: 0,
            humidity: 0,
            light_hours: 0,
          }
        end
      else
        {
          room_temperature: 0,
          humidity: 0,
          light_hours: 0,
        }
      end
    end

    def find_group_strain(plants)
      if plants.present?
        strain_group = plants.group_by { |a| a[:facility_strain_id].to_s }
        strain_group.map do |a, b|
          {
            strain_name: Inventory::FacilityStrain.find(a)&.strain_name,
            count: b.count,
          }
        end
      else
        []
      end
    end
  end
end

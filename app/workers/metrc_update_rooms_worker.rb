class MetrcUpdateRoomsWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(facility_id)
    @facility_id = facility_id
    # Overview of the logic flow
    # Get rooms from api (1)
    # Get rooms from db (2)
    # When found new rooms in (2)
    #   call create rooms api
    # When found existing rooms
    #   call update rooms api

    metrc_rooms = MetrcApi.get_rooms(facility.site_license) # Hash format
    local_rooms = facility.rooms.to_a # Ruby object format
    new_rooms = get_new_rooms(metrc_rooms, local_rooms)

    # Create new rooms in Metrc
    create_rooms_on_metrc(new_rooms, local_rooms)

    # Detect changes and update in Metrc
    update_rooms_on_metrc(local_rooms, metrc_rooms)

    # Update Metrc Id to local copy
    update_local_metrc_ids(local_rooms)

    true
  rescue RestClient::ExceptionWithResponse => e
    pp JSON.parse(e.response.body)
    raise
  end

  private

  def facility
    @facility ||= Facility.find(@facility_id)
  end

  def get_new_rooms(metrc_rooms, local_rooms)
    metrc_rooms_name = metrc_rooms.map { |s| s['Name'].downcase }
    new_rooms = []
    local_rooms.each do |room|
      if !metrc_rooms_name.include?(room.name.downcase)
        # Clear metrc_id if room not found on Metrc (possibly being deleted)
        room.metrc_id = nil
        room.save
        # Remember all new records
        new_rooms << room.name
      end
    end
    new_rooms
  end

  def create_rooms_on_metrc(new_rooms, local_rooms)
    if new_rooms.any?
      new_rooms.each do |room_name|
        found = local_rooms.detect { |i| i.name == room_name }
        if found&.metrc_id.nil?
          # Only create new record when no metrc_id found
          params = {
            "Name": found.name,
          }
          MetrcApi.create_rooms(site_license, [params])
        end
      end
    end
  end

  def update_rooms_on_metrc(local_rooms, metrc_rooms)
    if local_rooms.any?
      local_rooms.each do |room|
        if room.metrc_id
          found = metrc_rooms.detect { |i| i['Name'].casecmp(room.name).zero? }
          if found && found['Name'] != room.name
            # Only call update when metrc_id exists and
            # room name not same (case sensitive)
            params = {
              "Id": room.metrc_id,
              "Name": room.name,
            }
            MetrcApi.update_rooms(site_license, [params])
          end
        end
      end
    end
  end

  def update_local_metrc_ids(local_rooms)
    metrc_rooms = MetrcApi.get_rooms(site_license) # Hash format
    if local_rooms.any?
      local_rooms.each do |room|
        found = metrc_rooms.detect { |i| i['Name'].casecmp(room.name).zero? }
        if found
          room.metrc_id = found['Id']
          room.save
        end
      end
    end
  end
end

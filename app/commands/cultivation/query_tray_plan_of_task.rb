module Cultivation
  class QueryTrayPlanOfTask
    prepend SimpleCommand

    attr_reader :cultivation_batch, :task_id

    def initialize(cultivation_batch_id, task_id)
      @cultivation_batch = Cultivation::Batch.find(cultivation_batch_id)
      @task_id = task_id
    end

    def call
      # 1. get availale trays
      task = cultivation_batch.tasks.find(task_id)

      # TODO: Duplicate & expand QueryAvailableTrays to retrieve all locations.
      available_trays = QueryAvailableTrays.call(
        start_date: Time.new(1901, 1, 1),
        end_date: Time.new(1901, 1, 1),
        facility_id: cultivation_batch.facility_strain.facility_id,
        purpose: task.phase,
      ).call.result

      # 2. filter from available to trays used in this batch.
      # TODO: add tray_ids filter into QueryAvailableTray
      tray_ids = cultivation_batch.tray_plans.where(phase: task.phase).pluck(:tray_id).map &:to_s
      available_trays = available_trays.select do |tray|
        tray_ids.include? tray.tray_id
      end

      # 3. retrieve upward from tray until room
      list = Hash.new { |hash, key| hash[key] = [] }
      available_trays.each do |tp|
        explode(list, tp)
      end

      locations = merge(list)
      locations
    end

    def merge(list)
      list[:facility].
        concat(list[:room]).
        concat(list[:row]).
        concat(list[:section]).
        concat(list[:shelf]).
        concat(list[:tray]).
        compact
    end

    def explode(collection, tray_plan)
      facility = AvailableLocation.new(
        id: tray_plan.facility_id,
        facility_id: tray_plan.facility_id,
        facility_code: tray_plan.facility_code,
        facility_name: tray_plan.facility_name,
        location_type: 'Facility',
      )
      append(collection, :facility, facility, :facility_id)

      room = AvailableLocation.new(
        id: tray_plan.room_id,
        facility_id: tray_plan.facility_id,
        facility_code: tray_plan.facility_code,
        facility_name: tray_plan.facility_name,
        room_id: tray_plan.room_id,
        room_is_complete: tray_plan.room_is_complete,
        room_name: tray_plan.room_name,
        room_code: tray_plan.room_code,
        room_purpose: tray_plan.room_purpose,
        location_type: 'Room',
      )
      append(collection, :room, room, :room_id)

      unless tray_plan.section_id.blank?
        section = AvailableLocation.new(
          id: tray_plan.section_id,
          facility_id: tray_plan.facility_id,
          facility_code: tray_plan.facility_code,
          facility_name: tray_plan.facility_name,
          room_id: tray_plan.room_id,
          room_is_complete: tray_plan.room_is_complete,
          room_name: tray_plan.room_name,
          room_code: tray_plan.room_code,
          room_purpose: tray_plan.room_purpose,
          row_id: tray_plan.row_id,
          row_name: tray_plan.row_name,
          row_code: tray_plan.row_code,
          section_id: tray_plan.section_id,
          section_name: tray_plan.section_name,
          section_code: tray_plan.section_code,
          section_purpose: tray_plan.section_purpose,
          location_type: 'Section',
        )
        append(collection, :section, section, :section_id)
      end

      row = AvailableLocation.new(
        id: tray_plan.row_id,
        facility_id: tray_plan.facility_id,
        facility_code: tray_plan.facility_code,
        facility_name: tray_plan.facility_name,
        room_id: tray_plan.room_id,
        room_is_complete: tray_plan.room_is_complete,
        room_name: tray_plan.room_name,
        room_code: tray_plan.room_code,
        room_purpose: tray_plan.room_purpose,
        row_id: tray_plan.row_id,
        row_name: tray_plan.row_name,
        row_code: tray_plan.row_code,
        location_type: 'Row',
      )
      append(collection, :row, row, :row_id)

      shelf = AvailableLocation.new(
        id: tray_plan.shelf_id,
        facility_id: tray_plan.facility_id,
        facility_code: tray_plan.facility_code,
        facility_name: tray_plan.facility_name,
        room_id: tray_plan.room_id,
        room_is_complete: tray_plan.room_is_complete,
        room_name: tray_plan.room_name,
        room_code: tray_plan.room_code,
        room_purpose: tray_plan.room_purpose,
        row_id: tray_plan.row_id,
        row_name: tray_plan.row_name,
        row_code: tray_plan.row_code,
        section_id: tray_plan.section_id,
        section_name: tray_plan.section_name,
        section_code: tray_plan.section_code,
        section_purpose: tray_plan.section_purpose,
        shelf_id: tray_plan.shelf_id,
        shelf_code: tray_plan.shelf_code,
        shelf_name: tray_plan.shelf_name,
        shelf_capacity: tray_plan.shelf_capacity,
        location_type: 'Shelf',
      )
      append(collection, :shelf, shelf, :shelf_id)

      tray = AvailableLocation.new(
        id: tray_plan.tray_id,
        facility_id: tray_plan.facility_id,
        facility_code: tray_plan.facility_code,
        facility_name: tray_plan.facility_name,
        room_id: tray_plan.room_id,
        room_is_complete: tray_plan.room_is_complete,
        room_name: tray_plan.room_name,
        room_code: tray_plan.room_code,
        room_purpose: tray_plan.room_purpose,
        row_id: tray_plan.row_id,
        row_name: tray_plan.row_name,
        row_code: tray_plan.row_code,
        section_id: tray_plan.section_id,
        section_name: tray_plan.section_name,
        section_code: tray_plan.section_code,
        section_purpose: tray_plan.section_purpose,
        shelf_id: tray_plan.shelf_id,
        shelf_code: tray_plan.shelf_code,
        shelf_name: tray_plan.shelf_name,
        shelf_capacity: tray_plan.shelf_capacity,
        tray_id: tray_plan.tray_id,
        tray_code: tray_plan.tray_code,
        tray_capacity: tray_plan.tray_capacity,
        tray_capacity_type: tray_plan.tray_capacity_type,
        tray_purpose: tray_plan.tray_purpose,
        location_type: 'Tray',
      )
      append(collection, :tray, tray, :tray_id)
    end

    def append(collection, collection_key, item, lookup_key)
      found = collection[collection_key].any? { |x| x.send(lookup_key) == item.send(lookup_key) }

      if !found
        collection[collection_key].append(item)
      end
    end
  end
end

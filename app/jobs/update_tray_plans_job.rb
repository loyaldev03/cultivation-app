class UpdateTrayPlansJob < ApplicationJob
  queue_as :default

  ##
  # :batch_id: String, Cultivation Batch id
  def perform(batch_id)
    # Find the corresponding batch
    batch = Cultivation::Batch.find(batch_id)
    # Find all 'phase' tasks
    phases = Cultivation::QueryBatchPhases.call(batch).result
    # Find all tray locations in database
    locations = QueryReadyTrays.call(batch.facility_id).result
    # Find all existing TrayPlans
    tray_plans = Cultivation::TrayPlan.where(batch_id: batch_id)

    # Step #2 - Culculate the number of Active Plants.
    # This is the capacity we need to book for a Tray
    phases.each do |phase_info|
      plant_cmd = Inventory::QueryPlants.call(
        batch_id: batch_id,
        growth_stages: [phase_info.phase],
      )
      if plant_cmd.success?
        plants = plant_cmd.result.to_a
        plants_groups = plants.group_by(&:location_id)
        plants_groups.each do |location_id, location_plants|
          tray_location = locations.detect do |a|
            a.tray_id.to_s == location_id.to_s
          end
          if !location_plants.empty?
            quantity = location_plants.length
            # Find existing TrayPlan for this location & phase
            tray_plan = tray_plans.detect do |x|
              x.phase == phase_info.phase && x.tray_id.to_s == location_id.to_s
            end
            if tray_plan.present?
              p "TODO: plan already exists"
              # TODO: If Found, Update quantity of tray plan
            else
              # If no existing booking record found, create a new one
              tray_plan = build_tray_plan(batch_id,
                                          phase_info,
                                          tray_location,
                                          quantity)
              Cultivation::TrayPlan.create(tray_plan)
            end
          end
        end
      end
    end

    # TODO #3 - Create / Update Tray Plans by phase of the plants
  end

  private

  def build_tray_plan(batch_id, phase_info, location, capacity)
    current_time = Time.now
    {
      batch_id: batch_id.to_bson_id,
      facility_id: location.facility_id,
      room_id: location.room_id,
      row_id: location.row_id,
      shelf_id: location.shelf_id,
      tray_id: location.tray_id,
      start_date: phase_info.start_date,
      end_date: phase_info.end_date,
      phase: phase_info.phase,
      capacity: capacity,
      is_active: true,
      c_at: current_time,
      u_at: current_time,
    }
  end
end

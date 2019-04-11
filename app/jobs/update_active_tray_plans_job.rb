class UpdateActiveTrayPlansJob < ApplicationJob
  queue_as :default

  # Re-create TrayPlan(s) that currently have plants. All subsequence
  # phases' plans will not be re-created.
  # Safely assume a batch would only contain plants of specific growth stage at
  # any given point in time.
  #
  # :batch_id: String, Cultivation Batch id
  def perform(batch_id)
    # Rails.logger.debug "\033[31m UpdateActiveTrayPlansJob: #{batch_id} \033[0m"
    # Find the corresponding batch
    batch = Cultivation::Batch.find(batch_id)
    # Find all 'phase' tasks
    phases = Cultivation::QueryBatchPhases.call(batch).result
    # Find all tray locations in database
    locations = QueryReadyTrays.call(batch.facility_id).result
    # Find all existing TrayPlans
    tray_plans = Cultivation::TrayPlan.where(batch_id: batch_id)
    # Culculate number of Active Plants, capacity that needs to be booked.
    phases.each do |phase_info|
      plant_groups, total = group_plants_by_location(batch_id, phase_info.phase)
      # p "total: #{total}"
      plant_groups.each do |location_id, location_plants|
        tray = locations.detect { |a| a.tray_id.to_s == location_id.to_s }
        if !location_plants.empty?
          quantity = location_plants.length
          # Find existing TrayPlan for this location & phase
          phase_plans = tray_plans.where(phase: phase_info.phase,
                                         tray_id: location_id)
          # Delete existing Tray Plans
          phase_plans.delete_all if !phase_plans.empty?
          # Create Tray Plan(s)
          recreate_tray_plans(batch_id, phase_info, quantity, tray)
          # Update batch's growth stage
          batch.current_growth_stage = phase_info.phase
        end
      end
      # Update info back to batch
      batch.quantity = total
      batch.save!
    end
  end

  private

  # Create TrayPlan(s) - Each plan cannot exceed tray's capacity
  # E.g. When quantity = 15, tray_capacity = 10 we create 2 Tray
  # plan, first plan with 10 capacity & 2nd plan with 5 capacity
  def recreate_tray_plans(batch_id, phase_info, quantity, tray)
    # p "Quantity: #{quantity}"
    loop do
      plan_capacity = if quantity >= tray.tray_capacity
                        tray.tray_capacity
                      else
                        quantity
                      end
      new_tray_plan = build_tray_plan(batch_id,
                                      phase_info,
                                      tray,
                                      plan_capacity)
      # p "TrayPlan # capacity : #{plan_capacity}"
      Cultivation::TrayPlan.create(new_tray_plan)
      quantity -= plan_capacity
      break if quantity <= 0
    end
  end

  # Find and group active plants by location
  def group_plants_by_location(batch_id, growth_stage)
    plant_cmd = Inventory::QueryPlants.call(
      batch_id: batch_id,
      growth_stages: [growth_stage],
    )
    if plant_cmd.success?
      plants = plant_cmd.result.to_a || []
      if !plants.empty?
        return plants.group_by(&:location_id), plants.length
      else
        return [], 0
      end
    else
      return [], 0
    end
  end

  def build_tray_plan(batch_id, phase_info, location, capacity)
    current_time = Time.current
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
      c_at: current_time,
      u_at: current_time,
    }
  end
end

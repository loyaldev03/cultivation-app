module Cultivation
  class SaveTrayPlans
    prepend SimpleCommand

    def initialize(batch_id, plans, quantity)
      @batch_id = batch_id&.to_bson_id
      @plans = plans
      @quantity = quantity
    end

    def call
      if @batch_id.present? && @plans.any?
        # Rails.logger.debug "\033[34m Find Batch: #{@batch_id} \033[0m"
        # Rails.logger.debug "\033[34m # of plans: #{@plans.length} \033[0m"
        batch = Cultivation::Batch.find_by(id: @batch_id)
        if batch.present?
          facility = Facility.find_by(id: batch.facility_id)
          # Save selected mother plants
          batch.selected_plants = get_selected_plants(
            batch.batch_source, @plans
          )
          batch.quantity = @quantity
          # Rails.logger.debug "\033[34m Found Batch \033[0m"
          batch_phases = Cultivation::QueryBatchPhases.call(
            batch,
            facility.growth_stages,
          ).result
          # Delete all existing location plans
          batch.tray_plans.delete_all
          phase_trays = consolidate_phase_trays(@plans)
          new_plans = []
          batch_phases.each do |phase_info|
            # New location plans
            phase_plan = phase_trays.detect { |p| p[:phase] == phase_info.phase }
            if phase_plan.present?
              # Rails.logger.debug "\033[34m trays for phase: \033[0m"
              trays = phase_plan[:trays]
              # Build new booking record of trays
              new_plans += build_tray_plans(batch.facility_id,
                                            batch.id,
                                            phase_info,
                                            trays)
            else
              Rails.logger.debug "\033[34m Missing phase plan for: #{phase_info.phase} \033[0m"
            end
          end
          batch.save!
          # Save all tray plans
          Cultivation::TrayPlan.collection.insert_many(new_plans)
          batch
        end
      end
    end

    private

    def get_selected_plants(batch_source, plans)
      selected_plants = []
      if batch_source == 'clones_from_mother'
        clone_plans = plans.select do |p|
          p[:phase] == Constants::CONST_CLONE
        end
        # Rails.logger.debug "\033[31m Clone Plans \033[0m"
        # Rails.logger.debug clone_plans.to_yaml
        mother_plants = clone_plans.map do |p|
          p[:trays]
        end
        mother_plants = mother_plants&.flatten&.compact
        # Rails.logger.debug "\033[31m Mother Plans Flatten \033[0m"
        # Rails.logger.debug mother_plants.to_yaml
        mother_plants.each do |p|
          sp = selected_plants.detect { |x| x[:plant_id] == p[:plant_id] }
          if sp
            sp[:quantity] += p[:tray_capacity].to_i
          else
            sp = {
              plant_id: p[:plant_id].to_bson_id,
              quantity: p[:tray_capacity].to_i,
            }
            selected_plants << sp
          end
        end
        # Rails.logger.debug "\033[31m Selected Plants \033[0m"
        # Rails.logger.debug selected_plants.to_yaml
      end
      selected_plants
    end

    # Consolidate trays of the same phase
    def consolidate_phase_trays(plans)
      tray_plans = []
      plans.each do |p|
        tp = tray_plans.detect { |x| x[:phase] == p[:phase] }
        if tp.present?
          tp[:quantity] += p[:quantity]
          tp[:trays] += p[:trays]
        else
          tray_plans << p
        end
      end
      tray_plans
    end

    def build_tray_plans(facility_id, batch_id, phase_info, trays = [])
      current_time = Time.zone.now
      plans = []
      trays.each do |tray|
        # Combine booked quantity for same Tray
        existing = plans.detect { |x| x[:tray_id] == tray[:tray_id].to_bson_id }
        if existing.present?
          existing[:capacity] += tray[:tray_capacity].to_i
        else
          plans << {
            facility_id: facility_id.to_bson_id,
            batch_id: batch_id.to_bson_id,
            room_id: tray[:room_id].to_bson_id,
            row_id: tray[:row_id].to_bson_id,
            shelf_id: tray[:shelf_id].to_bson_id,
            tray_id: tray[:tray_id].to_bson_id,
            start_date: phase_info.start_date,
            end_date: phase_info.end_date,
            capacity: tray[:tray_capacity].to_i, # Important: Must as integer for
            phase: phase_info.phase,
            c_at: current_time,
            u_at: current_time,
          }
        end
      end
      plans
    end
  end
end

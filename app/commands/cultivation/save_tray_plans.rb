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
        batch = Cultivation::Batch.find_by(id: @batch_id)
        if batch.present?
          facility = Facility.find_by(id: batch.facility_id)
          batch.quantity = @quantity
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
      plan_trays = Tray.in(id: trays.pluck(:tray_id)).to_a
      trays.each do |tray|
        tray_rec = plan_trays.detect { |t| t.id == tray[:tray_id].to_bson_id }
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
            tray_full_code: tray_rec.full_code,
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

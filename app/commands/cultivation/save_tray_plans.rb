module Cultivation
  class SaveTrayPlans
    prepend SimpleCommand

    attr_reader :batch_id, :locations

    def initialize(batch_id, plans, quantity)
      @batch_id = batch_id
      @plans = plans
      @quantity = quantity
    end

    def call
      cultivation_phases = [
        Constants::CONST_CLONE,
        Constants::CONST_VEG,
        Constants::CONST_VEG1,
        Constants::CONST_VEG2,
        Constants::CONST_FLOWER,
        Constants::CONST_DRY,
        Constants::CONST_CURE,
      ]

      if @batch_id.present? && @plans.any?
        # Rails.logger.debug "\033[34m Find Batch: #{@batch_id} \033[0m"
        # Rails.logger.debug "\033[34m # of plans: #{@plans.length} \033[0m"
        batch = Cultivation::Batch.find(@batch_id.to_bson_id)
        if batch.present?
          batch.quantity = @quantity
          # Rails.logger.debug "\033[34m Found Batch \033[0m"
          batch_phases = Cultivation::QueryBatchPhases.call(
            batch,
            cultivation_phases,
          ).result
          # Delete all existing location plans
          batch.tray_plans.delete_all
          new_plans = []
          batch_phases.each do |phase_info|
            # New location plans
            phase_plan = @plans.detect { |p| p['phase'] == phase_info.phase }
            # Rails.logger.debug "\033[34m trays for phase: \033[0m"
            locations = phase_plan['trays']
            # Build new booking record of trays
            new_plans += build_tray_plans(batch.facility_id,
                                          batch.id,
                                          phase_info,
                                          locations)
            # Rails.logger.debug "\033[34m new_plans build: \033[0m"
            # Rails.logger.debug new_plans.to_json
          end
          # Rails.logger.debug "\033[34m insert_many new_plans \033[0m"
          # Save all new location plans
          batch.save!
          Cultivation::TrayPlan.collection.insert_many(new_plans)
        end
      end
    end

    private

    def build_tray_plans(facility_id, batch_id, phase_info, locations = [])
      current_time = Time.now
      locations.map do |loc|
        {
          facility_id: facility_id.to_bson_id,
          batch_id: batch_id.to_bson_id,
          room_id: loc[:room_id].to_bson_id,
          row_id: loc[:row_id].to_bson_id,
          shelf_id: loc[:shelf_id].to_bson_id,
          tray_id: loc[:tray_id].to_bson_id,
          start_date: phase_info.start_date,
          end_date: phase_info.end_date,
          capacity: loc[:tray_capacity].to_i,
          phase: phase_info.phase,
          is_active: true,
          c_at: current_time,
          u_at: current_time,
        }
      end
    end
  end
end

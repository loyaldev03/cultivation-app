module Cultivation
  class SaveTrayPlans
    prepend SimpleCommand

    attr_reader :batch_id, :locations

    def initialize(batch_id, locations = [])
      @batch_id = batch_id
      @locations = locations
    end

    def call
      if @batch_id.present? && locations.any?
        # Get corresponding batch
        batch = Cultivation::Batch.find(@batch_id.to_bson_id)
        # Rails.logger.debug ">>> Batch Retrieves"
        # Delete all existing location plans
        existing_plans = batch.tray_plans.delete_all
        # Rails.logger.debug ">>> Tray Plans Deleted"
        # Build new booking record of trays
        current_time = Time.now
        new_plans = locations.map do |loc|
          {
            batch_id: batch.id,
            facility_id: batch.facility_id,
            room_id: loc[:room_id].to_bson_id,
            row_id: loc[:row_id].to_bson_id,
            shelf_id: loc[:shelf_id].to_bson_id,
            tray_id: loc[:tray_id].to_bson_id,
            capacity: loc[:tray_capacity].to_i,
            is_active: true,
            is_fulfilled: false,
            c_at: current_time,
            u_at: current_time,
          }
        end
        #Rails.logger.debug ">>> 104 >>> #{new_plans.length}"
        #Rails.logger.debug new_plans.to_yaml
        # Save all new location plans
        Cultivation::TrayPlan.collection.insert_many(new_plans)
      end
    end
  end
end

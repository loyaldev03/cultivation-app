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
        if batch.present?
          # Delete all existing location plans
          existing_plans = batch.tray_plans.delete_all
          # Build new booking record of trays
          new_plans = build_tray_plans(batch.facility_id, batch.id, locations)
          # Save all new location plans
          Cultivation::TrayPlan.collection.insert_many(new_plans)
        else
          Rollbar.warning("User trying to create Tray Plans with an invalid batch_id: #{@batch_id.to_s}")
        end
      end
    end

    private

    def build_tray_plans(facility_id, batch_id, locations = [])
      current_time = Time.now
      locations.map do |loc|
        {
          facility_id: facility_id.to_bson_id,
          batch_id: batch_id.to_bson_id,
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
    end
  end
end

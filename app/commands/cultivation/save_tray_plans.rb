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
      if @batch_id.present? && @plans.any?
        # Rails.logger.debug "\033[34m Find Batch: #{@batch_id} \033[0m"
        # Rails.logger.debug "\033[34m # of plans: #{@plans.length} \033[0m"
        batch = Cultivation::Batch.find_by(id: @batch_id.to_bson_id)
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
          new_plans = []
          batch_phases.each do |phase_info|
            # New location plans
            phase_plan = @plans.detect { |p| p[:phase] == phase_info.phase }
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
        mother_plants = mother_plants.flatten
        # Rails.logger.debug "\033[31m Mother Plans Flatten \033[0m"
        # Rails.logger.debug mother_plants.to_yaml
        mother_plants.each do |p|
          sp = selected_plants.detect { |x| x[:plant_id] == p[:plant_id] }
          if sp
            sp[:quantity] += p[:tray_capacity].to_i
          else
            sp = {
              plant_id: p[:plant_id],
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
          c_at: current_time,
          u_at: current_time,
        }
      end
    end
  end
end

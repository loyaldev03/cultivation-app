module Procurement
  class FindManifest
    prepend SimpleCommand
    attr_reader :current_user,
                :args

    def initialize(current_user, args)
      @current_user = current_user
      @args = args
    end

    def call
      manifest = Procurement::Manifest.find_or_initialize_by(
        manifest_no: @args[:manifest_no],
      )
      {
        manifest_no: manifest.manifest_no,
        phase: manifest.plant_stage,
        plant_date: manifest.plant_date,
        plants: get_manifest_plants(manifest.manifest_no),
      }
    end

    private

    def get_manifest_plants(manifest_no)
      plants = Inventory::Plant.where(manifest_no: manifest_no)
      plant_json = []
      plants.each do |plant|
        plant_json << {
          plant_id: plant.id.to_s,
          old_tag: plant.old_tag,
          new_tag: plant.plant_tag,
          location_id: plant.location_id.to_s,
        }
      end
      Rails.logger.debug "Plant Json ==> #{plant_json}"
      return plant_json
    end
  end
end

module Procurement
  class SaveManifest
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
      manifest.plant_stage = @args[:plant_stage]
      manifest.plant_date = @args[:plant_date]
      if manifest.save
        manifest_plants = []
        @args[:plants].each do |plant|
          record = plant[:plant_id].nil? ? Inventory::Plant.new : Inventory::Plant.find(plant[:plant_id])
          record.manifest_no = manifest[:manifest_no]
          record.old_tag = plant[:old_tag]
          record.plant_tag = plant[:new_tag]
          record.location_id = plant[:location_id]
          record.current_growth_stage = @args[:plant_stage]
          record.save
          manifest_plants << record
        end

        manifest_plants_second = Inventory::Plant.where(manifest_no: manifest[:manifest_no])
        ids = manifest_plants.pluck(:id)
        destory_ids = []
        manifest_plants_second.each do |ps|
          unless ids.include? ps.id
            destory_ids << ps.id
          end
        end
        Inventory::Plant.collection.find({'_id': {'$in': destory_ids}}).delete_many
      end
    end
  end
end

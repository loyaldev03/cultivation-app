class SeedMetrcHistoriesCode < Mongoid::Migration
  def self.up
    Facility.all.each do |facility|
      facility.metrc_histories.find_or_create_by(code: "state_item_categories")
      facility.metrc_histories.find_or_create_by(code: "state_unit_of_measures")

      facility.metrc_histories.find_or_create_by(code: "facility_facility_read")
      facility.metrc_histories.find_or_create_by(code: "facility_strains")
      facility.metrc_histories.find_or_create_by(code: "facility_items")
      facility.metrc_histories.find_or_create_by(code: "facility_rooms")

      facility.metrc_histories.find_or_create_by(code: "tags_receive_tags")
      facility.metrc_histories.find_or_create_by(code: "tags_void_unused_tag")

      facility.metrc_histories.find_or_create_by(code: "batches_batch_types")
      facility.metrc_histories.find_or_create_by(code: "batches_create_batch")
      facility.metrc_histories.find_or_create_by(code: "batches_active_batch")
      facility.metrc_histories.find_or_create_by(code: "batches_change_grow_phase")
      facility.metrc_histories.find_or_create_by(code: "batches_move_plant_batches")
      facility.metrc_histories.find_or_create_by(code: "batches_create_package")
      facility.metrc_histories.find_or_create_by(code: "batches_destroyed_plant")

      facility.metrc_histories.find_or_create_by(code: "plants_waste_methods")
      facility.metrc_histories.find_or_create_by(code: "plants_waste_reasons")
      facility.metrc_histories.find_or_create_by(code: "plants_growth_phase")
      facility.metrc_histories.find_or_create_by(code: "plants_create_planting")
      facility.metrc_histories.find_or_create_by(code: "plants_moving")
      facility.metrc_histories.find_or_create_by(code: "plants_destroy_plant")
      facility.metrc_histories.find_or_create_by(code: "plants_destroyed_by_rooms")
      facility.metrc_histories.find_or_create_by(code: "plants_replace_tags")
      facility.metrc_histories.find_or_create_by(code: "plants_record_plant_waste")
      facility.metrc_histories.find_or_create_by(code: "plants_create_harvest")
      facility.metrc_histories.find_or_create_by(code: "plants_manicure")

      facility.metrc_histories.find_or_create_by(code: "harvest_info")
      facility.metrc_histories.find_or_create_by(code: "harvest_create_package")
      facility.metrc_histories.find_or_create_by(code: "harvest_remove_package")
      facility.metrc_histories.find_or_create_by(code: "harvest_finish")
      facility.metrc_histories.find_or_create_by(code: "harvest_unfinish")

      facility.metrc_histories.find_or_create_by(code: "package_types")
      facility.metrc_histories.find_or_create_by(code: "package_adjust_reasons")
      facility.metrc_histories.find_or_create_by(code: "package_info")
      facility.metrc_histories.find_or_create_by(code: "package_list_active")
      facility.metrc_histories.find_or_create_by(code: "package_list_on_hold")
      facility.metrc_histories.find_or_create_by(code: "package_create_from_harvest_batch")
      facility.metrc_histories.find_or_create_by(code: "package_adjust")
      facility.metrc_histories.find_or_create_by(code: "package_create_for_testing")
      facility.metrc_histories.find_or_create_by(code: "package_change_item")
      facility.metrc_histories.find_or_create_by(code: "package_change_room")
      facility.metrc_histories.find_or_create_by(code: "package_finish")
      facility.metrc_histories.find_or_create_by(code: "package_unfinish")
    end
  end

  def self.down
    Facility.all.each do |facility|
      facility.metrc_histories.delete_all
    end
  end
end
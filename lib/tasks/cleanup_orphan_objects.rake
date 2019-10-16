desc "Cleanup orphan records"

task cleanup_orphan_records: :environment do
  facility_ids = Facility.all.pluck(:id)

  batches = Cultivation::Batch.not_in(facility_id: facility_ids).to_a
  current_user = User.first
  batches.each do |batch|
    Cultivation::DestroyBatch.call(current_user, batch.id)
  end

  shelves_ids = Facility.collection.aggregate([
    { "$unwind": { path: "$rooms" } }, 
    { "$unwind": { path: "$rooms.rows" } }, 
    { "$unwind": { path: "$rooms.rows.shelves" } },
    { "$project": {
        _id: 0,
        shelf_id: "$rooms.rows.shelves._id"
    }}
  ]).to_a.pluck(:shelf_id)


  Cultivation::TrayPlan.not_in(facility_id: facility_ids).delete_all

  Cultivation::Task.not_in(facility_id: facility_ids).delete_all

  Tray.not_in(shelf_id: shelves_ids).delete_all
end

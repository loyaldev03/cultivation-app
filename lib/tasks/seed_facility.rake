desc "Create dummy facility 1 at a time"
task seed_facility: :environment  do
  Facility.create!(
    name: 'Facility 1',
    code: 'F1',
    is_complete: true
  )
end
FactoryBot.define do
  factory :facility_strain, class: Inventory::FacilityStrain do
    created_by { create(:user) }
    facility_id { create(:facility) }
    strain_name { Faker::Name.name }
    strain_type { "sativa" }
    sativa_makeup { Faker::Number.number(2).to_i }
    indica_makeup { Faker::Number.number(2).to_i }
    testing_status { 'external' }
    thc { Faker::Number.number(2).to_i / 100 }
    cbd { Faker::Number.number(1).to_i / 100 }
  end
end

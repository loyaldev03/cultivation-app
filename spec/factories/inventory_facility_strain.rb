FactoryBot.define do
  factory :facility_strain, class: Inventory::FacilityStrain do
    created_by { create(:user) }
    facility_id { create(:facility) }
    strain_name { 'OG Kush1' }
    strain_type { 'sativa' }
    sativa_makeup { '11' }
    indica_makeup { '80' }
    testing_status { 'external' }
    thc { '3' }
    cbd { '88' }
  end
end



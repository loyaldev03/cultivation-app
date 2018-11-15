FactoryBot.define do
  factory :catalogue, class: Inventory::Catalogue do
    catalogue_type { "raw_materials" }
    key { "others" }
    label { "Others" }
  end
end

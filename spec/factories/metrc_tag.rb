FactoryBot.define do
  factory :metrc_tag, class: Inventory::MetrcTag do
    status { 'available' }
    tag_type { 'package'}
    tag { 'package1' }
  end
end

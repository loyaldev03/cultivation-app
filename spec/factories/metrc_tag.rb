FactoryBot.define do
  factory :metrc_tag, class: Inventory::MetrcTag do
    status { Constants::METRC_TAG_STATUS_AVAILABLE }
    tag_type { Constants::METRC_TAG_TYPE_PLANT }
    tag { Faker::Alphanumeric.alphanumeric 21 }

    trait :assigned do
      status { Constants::METRC_TAG_STATUS_ASSIGNED }
    end

    trait :package do
      tag_type { Constants::METRC_TAG_TYPE_PACKAGE }
    end

    facility
  end
end

FactoryBot.define do
  factory :company_info, class: CompanyInfo do
    name { Faker::Name.name }
    phone { Faker::PhoneNumber.phone_number }
    metrc_ready { false }
    enable_metrc_integration { false }
    timezone { 'Pacific Time (US & Canada)' }
    is_active { true }
  end
end

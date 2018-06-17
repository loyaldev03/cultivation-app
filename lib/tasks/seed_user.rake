desc "Create dummy Supplier, 10 at a time"
task seed_user: :environment  do
  User.create!(
    first_name: 'dev-user',
    email: 'dev@email.com',
    password: 'password',
    password_confirmation: 'password',
    role: 'dev'
  )
  
  # 10.times do 
  #   Supplier.create!(
  #     name: Faker::Company.name,
  #     company_no: Faker::Company.duns_number,
  #     address1: Faker::Address.street_address,
  #     address2: Faker::Address.street_name,
  #     city: Faker::Address.city,
  #     postcode: Faker::Address.postcode,
  #     state: Faker::Address.state,
  #     country: Faker::Address.country,
  #     contact_person: Faker::Name.name,
  #     email: Faker::Internet.email,
  #     telephone: Faker::PhoneNumber.phone_number
  #   )
  # end
end
desc "Create dummy Supplier, 10 at a time"
task seed_user: :environment  do
  User.create!(
    first_name: 'dev-user',
    email: 'dev@email.com',
    password: 'password',
    password_confirmation: 'password',
    role: 'dev'
  )
end
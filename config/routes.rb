Rails.application.routes.draw do
  get "facility_setup/new" => "facility_setup#new"
  post "facility_setup/create" => "facility_setup#create"

  devise_for :users
  root to: "home#index"
end
